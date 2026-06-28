import { answersRepository } from '../../common/repositories/answers.repository';
import { questionsRepository } from '../../common/repositories/questions.repository';
import { usersRepository } from '../../common/repositories/users.repository';

export class AnswersService {
    async getAnswersByQuestion(questionId: string) {
        return answersRepository.findByQuestionId(questionId);
    }

    async createAnswer(questionId: string, authorId: string, data: any) {
        const existingAnswer =
            await answersRepository.findByAuthorAndQuestion(
                questionId,
                authorId
            );

        if (existingAnswer) {
            throw new Error('User already answered this question');
        }

        const answer = await answersRepository.create({
            ...data,
            questionId,
            authorId
        });

        await questionsRepository.updateAnswerCount(
            questionId,
            1
        );

        return answer.populate('authorId', 'name username avatarUrl reputation');
    }

    async updateAnswer(answerId: string, userId: string, userReputation: number, data: any) {
        const answer = await answersRepository.findById(answerId);
        if (!answer) throw new Error('Answer not found');

        if (answer.authorId.toString() !== userId && userReputation < 200) {
            throw new Error('Forbidden: Not enough reputation to edit');
        }

        return answersRepository.updateById(
            answerId,
            data
        );
    }

    async deleteAnswer(answerId: string, userId: string, userRole: string) {
        const answer = await answersRepository.findById(answerId);
        if (!answer) throw new Error('Answer not found');

        if (userRole !== 'moderator') {
            if (answer.authorId.toString() !== userId) throw new Error('Forbidden: Not author');
            if (answer.isAccepted || answer.voteCount > 0) throw new Error('Forbidden: Cannot delete accepted or upvoted answers');
        }

        await questionsRepository.updateAnswerCount(
            answer.questionId.toString(),
            -1
        );
        await answersRepository.deleteById(answerId);

        return true;
    }

    async voteAnswer(answerId: string, userId: string, value: number) {
        const answer =
            await answersRepository.updateVoteCount(
                answerId,
                value
            );

        // +10 por upvote, -2 por downvote na reputação do autor
        const repChange = value === 1 ? 10 : -2;
        await usersRepository.incrementReputation(
            answer!.authorId.toString(),
            repChange
        );
        return { votes: answer!.voteCount, userVote: value };
    }

    async acceptAnswer(answerId: string, userId: string) {
        const answer = await answersRepository.findById(answerId);
        if (!answer) throw new Error('Answer not found');

        const questionId = answer.questionId.toString();
        const question = await questionsRepository.findById(questionId);
        if (!question || question.authorId.toString() !== userId) {
            throw new Error('Forbidden: Only question author can accept answers');
        }

        await answersRepository.unmarkAcceptedForQuestion(
            answer.questionId.toString()
    
        );

        const acceptedAnswer =
            await answersRepository.markAccepted(answerId);
        if (!acceptedAnswer) throw new Error('Answer not found');

        await questionsRepository.setAcceptedAnswer(
            answer.questionId.toString(),
            answerId
        );

        await usersRepository.incrementReputation(
            answer.authorId.toString(),
            15
        );

        return acceptedAnswer;
    }
}