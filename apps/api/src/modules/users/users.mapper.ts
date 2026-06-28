import type { User } from '../../common/models/users.model';
import type { HydratedDocument } from 'mongoose';

/**
 * Converte o documento Mongoose em um objeto seguro para resposta pública.
 * Nunca deixar `res.json(user)` direto no controller — isso vaza passwordHash
 * e expõe `_id` em vez de `id`.
 */
export function toUserResponse(user: HydratedDocument<User>) {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl ?? null,
    bio: user.bio ?? null,
    reputation: user.reputation,
    badges: user.badges ?? { gold: 0, silver: 0, bronze: 0 },
    createdAt: user.createdAt.toISOString(),
  };
}
