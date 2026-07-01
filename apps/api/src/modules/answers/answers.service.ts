import { answersRepository } from '../../common/repositories/answers.repository';
import { questionsRepository } from '../../common/repositories/questions.repository';
import { usersRepository } from '../../common/repositories/users.repository';
import { HttpError } from '../../common/errors/http-error';
import { resolveVote, reputationFor } from '../../common/services/voting.service';

const ANSWER_UPVOTE_POINTS = 10;
const ANSWER_DOWNVOTE_PENALTY = -2;

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
            throw new HttpError(409, 'User already answered this question');
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
        if (!answer) throw new HttpError(404, 'Answer not found');

        if (answer.authorId.toString() !== userId && userReputation < 200) {
            throw new HttpError(403, 'Forbidden: Not enough reputation to edit');
        }

        return answersRepository.updateById(
            answerId,
            data
        );
    }

    async deleteAnswer(answerId: string, userId: string, userRole: string) {
        const answer = await answersRepository.findById(answerId);
        if (!answer) throw new HttpError(404, 'Answer not found');

        if (userRole !== 'moderator') {
            if (answer.authorId.toString() !== userId) throw new HttpError(403, 'Forbidden: Not author');
            if (answer.isAccepted || answer.voteCount > 0) throw new HttpError(403, 'Forbidden: Cannot delete accepted or upvoted answers');
        }

        await questionsRepository.updateAnswerCount(
            answer.questionId.toString(),
            -1
        );
        await answersRepository.deleteById(answerId);

        return true;
    }

    async voteAnswer(answerId: string, userId: string, value: number) {
        if (value !== 1 && value !== -1) throw new HttpError(400, 'value must be 1 or -1');

        const existingAnswer = await answersRepository.findById(answerId);
        if (!existingAnswer) throw new HttpError(404, 'Answer not found');
        if (existingAnswer.authorId.toString() === userId) {
            throw new HttpError(403, 'You cannot vote on your own answer');
        }

        const { voteCountDelta, userVote, previousValue } = await resolveVote(
            userId,
            'answer',
            answerId,
            value,
        );

        const answer = await answersRepository.updateVoteCount(answerId, voteCountDelta);
        if (!answer) throw new HttpError(404, 'Answer not found');

        const repChange =
            reputationFor(userVote, ANSWER_UPVOTE_POINTS, ANSWER_DOWNVOTE_PENALTY) -
            reputationFor(previousValue, ANSWER_UPVOTE_POINTS, ANSWER_DOWNVOTE_PENALTY);
        if (repChange !== 0) {
            await usersRepository.incrementReputation(answer.authorId.toString(), repChange);
        }

        return { votes: answer.voteCount, userVote };
    }

    async acceptAnswer(answerId: string, userId: string) {
        const answer = await answersRepository.findById(answerId);
        if (!answer) throw new HttpError(404, 'Answer not found');

        const questionId = answer.questionId.toString();
        const question = await questionsRepository.findById(questionId);
        if (!question || question.authorId._id.toString() !== userId) {
            throw new HttpError(403, 'Forbidden: Only question author can accept answers');
        }

        await answersRepository.unmarkAcceptedForQuestion(
            answer.questionId.toString()

        );

        const acceptedAnswer =
            await answersRepository.markAccepted(answerId);
        if (!acceptedAnswer) throw new HttpError(404, 'Answer not found');

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