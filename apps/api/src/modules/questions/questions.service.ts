import { questionsRepository } from '../../common/repositories/questions.repository';
import { answersRepository } from '../../common/repositories/answers.repository';
import { usersRepository } from '../../common/repositories/users.repository';
import { tagsRepository } from '../../common/repositories/tags.repository';
import { HttpError } from '../../common/errors/http-error';
import { resolveVote, reputationFor } from '../../common/services/voting.service';
import { toQuestionResponse } from './questions.mapper';

const QUESTION_UPVOTE_POINTS = 5;
const QUESTION_DOWNVOTE_PENALTY = -2;

export class QuestionsService {
    async listQuestions(query: any) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20', 10)));

        let tagId: string | undefined;

        if (query.tag) {
        const tag = await tagsRepository.findBySlug(query.tag);

        if (!tag) {
            throw new HttpError(404, "Tag not found");
        }

        tagId = tag._id.toString();
}
        const [questions, totalItems] = await Promise.all([
            questionsRepository.list({
                page,
                limit,
                search: query.search,
                tagId,
                sort: query.sort
            }),
            questionsRepository.count({
                search: query.search,
                tagId
            })
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: questions.map(toQuestionResponse),
            meta: {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }

    async createQuestion(authorId: string, data: any) {
        // `data.tags` chega como nomes de tag (ex: ["docker"]); o model espera ObjectIds.
        // findOrCreateByName resolve tags existentes e cria as que ainda não existem.
        const tagDocs = await Promise.all(
            (data.tags ?? []).map((name: string) => tagsRepository.findOrCreateByName(name)),
        );

        const created = await questionsRepository.create({
            ...data,
            tags: tagDocs.map((tag) => tag._id),
            authorId,
        });

        const question = await questionsRepository.findById(created._id.toString());

        return toQuestionResponse(question!);
    }

    async getQuestionDetail(questionId: string) {
        // Incrementa a visualização de forma atômica
        const question =
            await questionsRepository.incrementViews(
                questionId
            );

        if (!question)
            throw new HttpError(404, 'Question not found');

        return toQuestionResponse(question);
    }

    async updateQuestion(questionId: string, userId: string, userReputation: number, data: any) {
        const question = await questionsRepository.findById(questionId);
        if (!question) throw new HttpError(404, 'Question not found');

        // Regra: Apenas o autor ou usuário com rep >= 200 pode editar
        if (question.authorId._id.toString() !== userId && userReputation < 200) {
            throw new HttpError(403, 'Forbidden: Not enough reputation to edit');
        }

        const updated = await questionsRepository.updateById(
            questionId,
            data
        );

        return toQuestionResponse(updated!);
    }

    async deleteQuestion(questionId: string, userId: string, userRole: string) {
        const question = await questionsRepository.findById(questionId);
        if (!question) throw new HttpError(404, 'Question not found');

        // Regra: Moderadores podem apagar. Autores só podem apagar se não houver respostas.
        const hasAnswers =
            await answersRepository.existsByQuestionId(
                questionId
            );
        if (userRole !== 'moderator') {
            if (question.authorId._id.toString() !== userId) throw new HttpError(403, 'Forbidden: Only author or moderator can delete');
            if (hasAnswers) throw new HttpError(403, 'Forbidden: Cannot delete a question that has answers');
        }

        await answersRepository.deleteByQuestionId(
            questionId
        );

        await questionsRepository.deleteById(
            questionId
        );
        return true;
    }

    async voteQuestion(questionId: string, userId: string, value: number) {
        if (value !== 1 && value !== -1) throw new HttpError(400, 'value must be 1 or -1');

        const existingQuestion = await questionsRepository.findById(questionId);
        if (!existingQuestion) throw new HttpError(404, 'Question not found');
        if (existingQuestion.authorId._id.toString() === userId) {
            throw new HttpError(403, 'You cannot vote on your own question');
        }

        const { voteCountDelta, userVote, previousValue } = await resolveVote(
            userId,
            'question',
            questionId,
            value,
        );

        const question = await questionsRepository.updateVoteCount(questionId, voteCountDelta);
        if (!question) throw new HttpError(404, 'Question not found');

        const repChange =
            reputationFor(userVote, QUESTION_UPVOTE_POINTS, QUESTION_DOWNVOTE_PENALTY) -
            reputationFor(previousValue, QUESTION_UPVOTE_POINTS, QUESTION_DOWNVOTE_PENALTY);
        if (repChange !== 0) {
            await usersRepository.incrementReputation(question.authorId._id.toString(), repChange);
        }

        return { votes: question.voteCount, userVote };
    }

    async closeQuestion(questionId: string, reason: string) {
        const question = await questionsRepository.closeQuestion(questionId, reason);
        if (!question) throw new HttpError(404, 'Question not found');
        return question;
    }
}
