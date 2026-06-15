import { questionsRepository } from '../../common/repositories/questions.repository';
import { answersRepository } from '../../common/repositories/answers.repository';
import { usersRepository } from '../../common/repositories/users.repository';

export class QuestionsService {
    async listQuestions(query: any) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;

        const filter: any = {};
        if (query.search) {
            filter.$text = { $search: query.search }; // Requer índice de texto no Mongoose
        }
        if (query.tag) {
            filter.tags = query.tag; // Filtra perguntas que contêm esta tag
        }

        let sortOption: any = { createdAt: -1 };
        switch (query.sort) {
            case 'active': sortOption = { updatedAt: -1 }; break;
            case 'votes': sortOption = { votes: -1 }; break;
            case 'unanswered':
                filter.answersCount = 0;
                sortOption = { createdAt: -1 };
                break;
            case 'newest': default: sortOption = { createdAt: -1 }; break;
        }

        const [questions, totalItems] = await Promise.all([
            questionsRepository.list({
                page,
                limit,
                search: query.search,
                tagId: query.tag,
                sort: query.sort
            }),
            questionsRepository.count({
                search: query.search,
                tagId: query.tag
            })
        ]);

        return { questions, meta: { currentPage: page, pageSize: limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
    }

    async createQuestion(authorId: string, data: any) {
        return questionsRepository.create({
            ...data,
            authorId
        });
    }

    async getQuestionDetail(questionId: string) {
        // Incrementa a visualização de forma atômica
        const question =
            await questionsRepository.incrementViews(
                questionId
            );

        if (!question)
            throw new Error('Question not found');

        return question;
    }

    async updateQuestion(questionId: string, userId: string, userReputation: number, data: any) {
        const question = await questionsRepository.findById(questionId);
        if (!question) throw new Error('Question not found');

        // Regra: Apenas o autor ou usuário com rep >= 200 pode editar
        if (question.authorId.toString() !== userId && userReputation < 200) {
            throw new Error('Forbidden: Not enough reputation to edit');
        }

        return questionsRepository.updateById(
            questionId,
            data
        );
    }

    async deleteQuestion(questionId: string, userId: string, userRole: string) {
        const question = await questionsRepository.findById(questionId);
        if (!question) throw new Error('Question not found');

        // Regra: Moderadores podem apagar. Autores só podem apagar se não houver respostas.
        const hasAnswers =
            await answersRepository.existsByQuestionId(
                questionId
            );
        if (userRole !== 'moderator') {
            if (question.authorId.toString() !== userId) throw new Error('Forbidden: Only author or moderator can delete');
            if (hasAnswers) throw new Error('Forbidden: Cannot delete a question that has answers');
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
        // Implementação simplificada. O ideal seria usar o 'VotesModel' para registrar o voto do usuário e evitar votos duplicados.
        const question =
            await questionsRepository.updateVoteCount(
                questionId,
                value
            );
        if (!question) throw new Error('Question not found');

        // +5 por upvote, -2 por downvote na reputação do autor
        const repChange = value === 1 ? 5 : -2;
        await usersRepository.incrementReputation(
            question.authorId.toString(),
            repChange
        );
        return { votes: question.voteCount, userVote: value };
    }

    async closeQuestion(questionId: string, reason: string) {
        return questionsRepository.closeQuestion(
            questionId,
            reason
        );
    }
}