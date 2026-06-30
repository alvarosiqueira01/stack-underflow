import type { HydratedDocument } from 'mongoose';
import type { Comment } from '../../common/models/comments.model';
import type { User } from '../../common/models/users.model';

/** Converte o documento Mongoose (com `authorId` populado) para o formato do `CommentSchema`. */
export function toCommentResponse(comment: HydratedDocument<Comment>) {
  const author = comment.authorId as unknown as HydratedDocument<User>;

  return {
    id: comment._id.toString(),
    body: comment.body,
    author: {
      id: author._id.toString(),
      name: author.name,
      username: author.username,
      avatarUrl: author.avatarUrl ?? null,
      reputation: author.reputation,
    },
    createdAt: comment.createdAt!.toISOString(),
  };
}
