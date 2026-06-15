import { Request, Response, NextFunction } from 'express';
import { TagsService } from './tags.service';

type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    reputation?: number;
    role?: string;
    [key: string]: any;
  };
};

const tagsService = new TagsService();

export class TagsController {
  async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { res.status(200).json(await tagsService.listTags(req.query)); } 
    catch (error) { next(error); }
  }

  async getDetail(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { 
        const tagId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!tagId) throw new Error('Tag id is required');
        res.status(200).json(await tagsService.getTagById(tagId)); } 
    catch (error) { next(error); }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { res.status(201).json(await tagsService.createTag(req.body)); } 
    catch (error) { next(error); }
  }

  async watchTags(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { 
      await tagsService.updateTagPreferences(req.user!.id, 'watch', req.body.tags);
      res.status(200).json({ message: 'Watched tags updated' }); 
    } catch (error) { next(error); }
  }

  async ignoreTags(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try { 
      await tagsService.updateTagPreferences(req.user!.id, 'ignore', req.body.tags);
      res.status(200).json({ message: 'Ignored tags updated' }); 
    } catch (error) { next(error); }
  }
}