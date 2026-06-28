import { Request, Response, NextFunction } from 'express';
import { AnswersService } from './answers.service';
import { toAnswerResponse } from './answers.mapper';

const answersService = new AnswersService();

export class AnswersController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const answers = await answersService.getAnswersByQuestion(req.params.id);
      res.status(200).json(answers.map(toAnswerResponse));
    }
    catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const answer = await answersService.createAnswer(req.params.id, req.user!.id, req.body);
      res.status(201).json(toAnswerResponse(answer));
    }
    catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try { res.status(200).json(await answersService.updateAnswer(req.params.id, req.user!.id, req.user!.reputation || 0, req.body)); } 
    catch (error) { next(error); }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try { 
      await answersService.deleteAnswer(req.params.id, req.user!.id, req.user!.role || 'user');
      res.status(204).send(); 
    } catch (error) { next(error); }
  }

  async vote(req: Request, res: Response, next: NextFunction) {
    try { res.status(200).json(await answersService.voteAnswer(req.params.id, req.user!.id, req.body.value)); } 
    catch (error) { next(error); }
  }

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const answer = await answersService.acceptAnswer(req.params.id, req.user!.id);
      res.status(200).json(toAnswerResponse(answer));
    }
    catch (error) { next(error); }
  }
}