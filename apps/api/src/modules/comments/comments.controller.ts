import { Request, Response, NextFunction } from 'express';
import { CommentsService } from './comments.service';
import { toCommentResponse } from './comments.mapper';
import { CreateCommentSchema } from '../questions/questions.schema';

const commentsService = new CommentsService();

export class CommentsController {
  async listForQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await commentsService.listForQuestion(req.params.id);
      res.status(200).json(comments.map(toCommentResponse));
    } catch (error) { next(error); }
  }

  async listForAnswer(req: Request, res: Response, next: NextFunction) {
    try {
      const comments = await commentsService.listForAnswer(req.params.id);
      res.status(200).json(comments.map(toCommentResponse));
    } catch (error) { next(error); }
  }

  async createForQuestion(req: Request, res: Response, next: NextFunction) {
    const parsed = CreateCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues, code: 400 });
      return;
    }

    try {
      const comment = await commentsService.createForQuestion(req.params.id, req.user!.id, parsed.data.body);
      res.status(201).json(toCommentResponse(comment));
    } catch (error) { next(error); }
  }

  async createForAnswer(req: Request, res: Response, next: NextFunction) {
    const parsed = CreateCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: parsed.error.issues, code: 400 });
      return;
    }

    try {
      const comment = await commentsService.createForAnswer(req.params.id, req.user!.id, parsed.data.body);
      res.status(201).json(toCommentResponse(comment));
    } catch (error) { next(error); }
  }
}
