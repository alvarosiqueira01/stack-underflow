import { commentsRepository } from '../../common/repositories/comments.repository';
import { questionsRepository } from '../../common/repositories/questions.repository';
import { answersRepository } from '../../common/repositories/answers.repository';
import { HttpError } from '../../common/errors/http-error';

export class CommentsService {
  async listForQuestion(questionId: string) {
    const question = await questionsRepository.findById(questionId);
    if (!question) throw new HttpError(404, 'Question not found');

    return commentsRepository.findByTarget('question', questionId);
  }

  async listForAnswer(answerId: string) {
    const answer = await answersRepository.findById(answerId);
    if (!answer) throw new HttpError(404, 'Answer not found');

    return commentsRepository.findByTarget('answer', answerId);
  }

  async createForQuestion(questionId: string, authorId: string, body: string) {
    const question = await questionsRepository.findById(questionId);
    if (!question) throw new HttpError(404, 'Question not found');

    return commentsRepository.create({ body, authorId, targetType: 'question', targetId: questionId } as any);
  }

  async createForAnswer(answerId: string, authorId: string, body: string) {
    const answer = await answersRepository.findById(answerId);
    if (!answer) throw new HttpError(404, 'Answer not found');

    return commentsRepository.create({ body, authorId, targetType: 'answer', targetId: answerId } as any);
  }
}
