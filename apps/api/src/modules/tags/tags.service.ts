import { tagsRepository } from '../../common/repositories/tags.repository';
import { userTagPreferencesRepository }
    from '../../common/repositories/user-tag-preferences.repository';

// Minimal local slugify implementation to avoid requiring the external 'slugify' package
function slugify(input: string) {
    return String(input)
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export class TagsService {
    async listTags(query: any) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.max(1, Math.min(100, parseInt(query.limit || '30', 10)));
        const skip = (page - 1) * limit;

        const filter = query.search ? { name: { $regex: query.search, $options: 'i' } } : {};

        const [tags, totalItems] =
            await Promise.all([
                tagsRepository.list({
                    page,
                    limit,
                    search: query.search
                }),
                tagsRepository.count({
                    search: query.search
                })
            ]);

        return { tags, meta: { currentPage: page, pageSize: limit, totalItems, totalPages: Math.ceil(totalItems / limit) } };
    }

    async getTagById(tagId: string) {
        const tag =
            await tagsRepository.findById(tagId);
        if (!tag) throw new Error('Tag not found');
        return tag;
    }

    async createTag(data: any) {
        const existing =
            await tagsRepository.findBySlug(
                slugify(data.name)
            );
        if (existing) throw new Error('Tag already exists');

        return tagsRepository.create(data);
    }

    async updateTagPreferences(userId: string, action: 'watch' | 'ignore', tags: string[]) {
        await Promise.all(
            tags.map(tagId =>
                userTagPreferencesRepository.setPreference(
                    userId,
                    tagId,
                    action === 'watch'
                        ? 'watching'
                        : 'ignoring'
                )
            )
        );
    }
}