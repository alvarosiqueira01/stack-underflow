import type { HydratedDocument } from 'mongoose';
import type { Answer } from '../../common/models/answers.model';
import type { User } from '../../common/models/users.model';

/**
 * Converte o documento Mongoose (com `authorId` populado) para o formato
 * documentado em `AnswerSchema`. `userVote` é sempre `null` pelo mesmo
 * motivo descrito em `questions.mapper.ts`.
 */
export function toAnswerResponse(answer: HydratedDocument<Answer>) {
  const author = answer.authorId as unknown as HydratedDocument<User>;

  return {
    id: answer._id.toString(),
    questionId: answer.questionId.toString(),
    body: answer.body,
    author: {
      id: author._id.toString(),
      name: author.name,
      username: author.username,
      avatarUrl: author.avatarUrl ?? null,
      reputation: author.reputation,
    },
    votes: answer.voteCount,
    userVote: null,
    isAccepted: answer.isAccepted,
    createdAt: answer.createdAt!.toISOString(),
    updatedAt: answer.updatedAt!.toISOString(),
  };
}
