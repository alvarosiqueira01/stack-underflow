import { Request, Response, NextFunction } from 'express';
import { QuestionsService } from './questions.service';
import { toQuestionResponse } from './questions.mapper';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    reputation?: number;
    role?: string;
    [key: string]: any;
  };
};

const questionsService = new QuestionsService();

export class QuestionsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try { res.status(200).json(await questionsService.listQuestions(req.query)); } 
    catch (error) { next(error); }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { 
      res.status(201).json(await questionsService.createQuestion(req.user!.id, req.body)); } 
    catch (error) { next(error); }
  }

  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const questionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!questionId) throw new Error('Question id is required');

      const question = await questionsService.getQuestionDetail(questionId);
      res.status(200).json(toQuestionResponse(question));
    } 
    catch (error) { next(error); }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const questionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!questionId) throw new Error('Question id is required');

      const userId = req.user!.id;
      const userReputation = req.user!.reputation || 0;

      const updated = await questionsService.updateQuestion(questionId, userId, userReputation, req.body);
      res.status(200).json(updated);
    } catch (error) { next(error); }
  }

  async remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { 
      const questionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!questionId) throw new Error('Question id is required');

      const userId = req.user!.id;
      const userReputation = req.user!.reputation || 0;

      await questionsService.deleteQuestion(questionId, userId, req.user!.role || 'user');
      res.status(204).send();
    } 
    catch (error) { next(error); }
  }

  async vote(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const questionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!questionId) throw new Error('Question id is required');

      const userId = req.user!.id;
      const userReputation = req.user!.reputation || 0;

      res.status(200).json(await questionsService.voteQuestion(questionId, userId, req.body.value));
    } 
    catch (error) { next(error); }
  }

  async close(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const questionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!questionId) throw new Error('Question id is required');

      const reason = req.body.reason;
      if (!reason) throw new Error('Close reason is required');

      res.status(200).json(await questionsService.closeQuestion(questionId, reason));
    } 
    catch (error) { next(error); }
  }
}