import { usersRepository } from '../../common/repositories/users.repository';
import { questionsRepository } from '../../common/repositories/questions.repository';
import { answersRepository } from '../../common/repositories/answers.repository';
import { userTagPreferencesRepository } from '../../common/repositories/userTagPreferences.repository';
import { HttpError } from '../../common/errors/http-error';
import { ObjectId } from 'mongoose';
import { tagsRepository } from '../../common/repositories/tags.repository';

export class UsersService {
    /**
     * Lista todos os usuários aplicando paginação padrão e filtros de busca opcionais.
     * Atende ao contrato: GET /api/users
     */
    async findAllUsers(query: any) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;

        const filter: any = {};

        // Filtro opcional por username ou display name usando regex case-insensitive
        if (query.search) {
            filter.$or = [
                { username: { $regex: query.search, $options: 'i' } },
                { displayName: { $regex: query.search, $options: 'i' } }
            ];
        }

        // Executa a busca paginada e a contagem total em paralelo para melhor performance
        const [users, totalItems] =
            await Promise.all([
                usersRepository.list({
                    page,
                    limit,
                    search: query.search
                }),
                usersRepository.count({
                    search: query.search
                })
            ]);

        const totalPages = Math.ceil(totalItems / limit);

        return {
            users,
            meta: {
                currentPage: page,
                pageSize: limit,
                totalItems,
                totalPages
            }
        };
    }

    /**
     * Busca o perfil público de um usuário por ID.
     * Atende ao contrato: GET /api/users/{id}
     */
    async findUserById(id: string) {
        const user =
            await usersRepository.findById(id);
        if (!user) {
            throw new HttpError(404, 'User not found');
        }
        return user;
    }

    /**
     * Atualiza parcialmente os dados permitidos do perfil do usuário autenticado.
     * Atende ao contrato: PUT /api/users/me
     */
    async updateProfile(userId: string, updateData: any) {
        // Sanitização estrita: impede a alteração maliciosa de dados protegidos como reputação ou papéis
        const allowedUpdates = ['name', 'bio', 'location', 'website', 'avatarUrl'];
        const sanitizedData: any = {};

        for (const key of allowedUpdates) {
            if (updateData[key] !== undefined) {
                sanitizedData[key] = updateData[key];
            }
        }

        if (Object.keys(sanitizedData).length === 0) {
            throw new HttpError(400, 'No valid fields provided for update');
        }

        const updatedUser =
            await usersRepository.updateProfile(
                userId,
                sanitizedData
            );

        if (!updatedUser) {
            throw new HttpError(404, 'User not found');
        }

        return updatedUser;
    }

    /**
     * Agrega e pagina o histórico público de atividades do usuário de forma cronológica decrescente.
     * Atende ao contrato: GET /api/users/{id}/activity
     */
    async getUserActivityFeed(userId: string, query: any) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;
        const options = { page, limit };
        const feed = await usersRepository.getActivityFeed(userId, options);
        const totalItems = feed.length;
        const paginatedItems = feed.slice(skip, skip + limit);

        return {
            activity: paginatedItems,
            meta: {
                currentPage: options.page,
                pageSize: options.limit,
                totalItems,
                totalPages: Math.ceil(totalItems / options.limit)
            }
        };
    }

    /**
     * Compila e calcula em tempo real as métricas complexas para o Dashboard privado do usuário.
     * Atende ao contrato: GET /api/users/me/dashboard
     */
    async getDashboardStats(userId: string) {
        const user = await usersRepository.findById(userId);
        if (!user) throw new HttpError(404, 'User not found');

        // Normalize stats whether repository returns an array (aggregation result) or an object
        const rawStats = await usersRepository.getDashboardStats(userId);
        const stats = Array.isArray(rawStats) && rawStats.length > 0 ? rawStats[0] : (rawStats || {});

        // compute acceptanceRate if not provided by the repository
        let acceptanceRate = 0;
        const questionCount = Number(stats.questionCount || 0);
        const acceptedAnswerCount = Number(stats.acceptedAnswerCount || 0);
        if (typeof stats.acceptanceRate === 'number') {
            acceptanceRate = stats.acceptanceRate;
        } else if (questionCount > 0) {
            acceptanceRate = acceptedAnswerCount / questionCount;
        }

        const topTagsAggregation = await questionsRepository.listTopTags(5)
        // Retorna a estrutura final unificada populando o Dashboard do Frontend
        return {
            reputation: user.reputation,
            badges: user.badges || { gold: 0, silver: 0, bronze: 0 },
            counts: {
                questions: questionCount,
                answers: Number(stats.answerCount || 0),
                acceptedAnswers: acceptedAnswerCount
            },
            acceptanceRate,
            topTags: topTagsAggregation
        };
    }

    async getTagPreferences(userId: string) {
        const prefs = await userTagPreferencesRepository.findByUser(userId);

        return {
            watchedTags: prefs
                .filter(p => p.status === "watching")
                .map(p => (p.tagId as any).slug),

            ignoredTags: prefs
                .filter(p => p.status === "ignoring")
                .map(p => (p.tagId as any).slug),
            };
    }

    async updateTagPreferences(
        userId: string,
        tagSlug: string,
        action: "watch" | "ignore",
    ) {
        const tag = await tagsRepository.findBySlug(tagSlug);

        if (!tag) {
            throw new HttpError(404, "Tag not found");
        }

        await userTagPreferencesRepository.setPreference(
            userId,
            tag._id.toString(),
            action === "watch" ? "watching" : "ignoring"
        );
    }
}