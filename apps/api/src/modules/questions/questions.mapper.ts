import type { HydratedDocument } from 'mongoose';
import type { Question } from '../../common/models/questions.model';
import type { User } from '../../common/models/users.model';
import type { Tag } from '../../common/models/tags.model';

/**
 * Converte o documento Mongoose (com `authorId` e `tags` populados) para o
 * formato documentado em `QuestionSchema`. Sem isso a resposta vaza `_id`,
 * `authorId` (não populado) e `voteCount`/`viewCount` em vez de
 * `votes`/`viewsCount`.
 *
 * `userVote` é sempre `null` — o modelo atual não rastreia o voto de cada
 * usuário individualmente (ver comentário em `questionsService.voteQuestion`).
 */
export function toQuestionResponse(question: HydratedDocument<Question>) {
  const author = question.authorId as unknown as HydratedDocument<User>;
  const tags = question.tags as unknown as HydratedDocument<Tag>[];

  return {
    id: question._id.toString(),
    title: question.title,
    body: question.body,
    tags: tags.map((tag) => tag.name),
    author: {
      id: author._id.toString(),
      name: author.name,
      username: author.username,
      avatarUrl: author.avatarUrl ?? null,
      reputation: author.reputation,
    },
    votes: question.voteCount,
    userVote: null,
    viewsCount: question.viewCount,
    answersCount: question.answerCount,
    acceptedAnswerId: question.acceptedAnswerId?.toString() ?? null,
    status: question.status,
    createdAt: question.createdAt!.toISOString(),
    updatedAt: question.updatedAt!.toISOString(),
  };
}
