import { Request, Response } from 'express';
import { ReviewActionSchema } from './reviews.schema';
import { reviewsService } from './reviews.service';

// -- GET /api/reviews

export async function reviewsListController(req: Request, res: Response): Promise<void> {
  try {
    const queues = await reviewsService.listQueues();
    res.status(200).json(queues);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}

// -- GET /api/reviews/:id

export async function reviewsGetController(req: Request, res: Response): Promise<void> {
  try {
    const task = await reviewsService.getTask(req.params.id as string);
    res.status(200).json(task);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}

// -- POST /api/reviews/:id/action

export async function reviewsActionController(req: Request, res: Response): Promise<void> {
  const parsed = ReviewActionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues, code: 400 });
    return;
  }

  try {
    const result = await reviewsService.submitAction(
      req.params.id as string,
      req.user!.sub,
      parsed.data.action,
      parsed.data.rejectionReasons,
    );
    res.status(200).json(result);
  } catch (err: any) {
    res.status(err.status ?? 500).json({ message: err.message, code: err.status ?? 500 });
  }
}
