import { ReviewTaskModel, ReviewAction, RejectionReason } from '../../common/models/review-task.model';

const QUEUE_META = {
  suggested_edits: {
    label: 'Suggested Edits',
    description: 'Review community-suggested edits to questions and answers.',
  },
  close_votes: {
    label: 'Close Votes',
    description: 'Review questions nominated for closure.',
  },
  low_quality_posts: {
    label: 'Low Quality Posts',
    description: 'Review posts flagged as low quality.',
  },
};

const QUORUM = 3;

// -- List queues

export async function listQueues() {
  const counts = await ReviewTaskModel.aggregate([
    { $match: { status: 'pending' } },
    { $group: { _id: '$queueType', pendingCount: { $sum: 1 } } },
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c._id, c.pendingCount]));

  return Object.entries(QUEUE_META).map(([type, meta]) => ({
    id: type,
    type,
    label: meta.label,
    description: meta.description,
    pendingCount: countMap[type] ?? 0,
  }));
}

// -- Get task

export async function getTask(id: string) {
  const task = await ReviewTaskModel.findById(id)
    .populate('submittedBy', 'username')
    .exec();

  if (!task) throw { status: 404, message: 'Review task not found.' };

  return task;
}

// -- Submit action

export async function submitAction(
  taskId: string,
  reviewerId: string,
  action: ReviewAction,
  rejectionReasons?: RejectionReason[],
) {
  const task = await ReviewTaskModel.findById(taskId).exec();

  if (!task) throw { status: 404, message: 'Review task not found.' };
  if (task.status !== 'pending') throw { status: 409, message: 'This review task is already closed.' };

  const alreadyReviewed = task.decisions.some(
    (d) => d.reviewerId.toString() === reviewerId,
  );
  if (alreadyReviewed) throw { status: 409, message: 'You have already reviewed this task.' };

  if (action === 'reject' && (!rejectionReasons || rejectionReasons.length === 0)) {
    throw { status: 400, message: 'rejectionReasons is required when action is "reject".' };
  }

  task.decisions.push({
    reviewerId: reviewerId as any,
    action,
    rejectionReasons,
    decidedAt: new Date(),
  });

  const approvals = task.decisions.filter((d) => d.action === 'approve').length;
  const rejections = task.decisions.filter((d) => d.action === 'reject').length;

  if (approvals >= QUORUM || rejections >= QUORUM) {
    task.status = 'completed';
  }

  await task.save();

  return {
    reviewId: task.id,
    action,
    reviewedAt: new Date().toISOString(),
  };
}
