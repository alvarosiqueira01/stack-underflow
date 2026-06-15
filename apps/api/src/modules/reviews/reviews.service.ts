import { reviewsRepository } from '../../common/repositories/reviews.repository';
import { reviewActions, rejectionReasons } from '../../common/models/reviews.model';

type ReviewAction = (typeof reviewActions)[number];
type RejectionReason = (typeof rejectionReasons)[number];

const QUEUE_META = {
  suggested_edit: {
    label: 'Suggested Edits',
    description: 'Review community-suggested edits to questions and answers.',
  },
  close_vote: {
    label: 'Close Votes',
    description: 'Review questions nominated for closure.',
  },
  low_quality_post: {
    label: 'Low Quality Posts',
    description: 'Review posts flagged as low quality.',
  },
  flag: {
    label: 'Community Flags',
    description: 'Review standard flags submitted by users.',
  }
};

const QUORUM = 3;

export const reviewsService = {

  async listQueues() {
    // Acessa as contagens de forma otimizada via repository
    const counts = await reviewsRepository.countPendingByType();
    const countMap = Object.fromEntries(counts.map((c) => [c._id, c.count]));

    return Object.entries(QUEUE_META).map(([type, meta]) => ({
      id: type,
      type,
      label: meta.label,
      description: meta.description,
      pendingCount: countMap[type] ?? 0,
    }));
  },

  async getTask(id: string) {
    const task = await reviewsRepository.findById(id);
    if (!task) throw { status: 404, message: 'Review task not found.' };
    return task;
  },

  async submitAction(
    taskId: string,
    reviewerId: string,
    action: ReviewAction,
    rejectionReasons?: RejectionReason[],
  ) {
    const task = await reviewsRepository.findById(taskId);

    if (!task) throw { status: 404, message: 'Review task not found.' };
    if (task.status !== 'pending') throw { status: 409, message: 'This review task is already closed.' };

    // Evita votos duplicados do mesmo usuário
    const alreadyReviewed = task.decisions.some(
      (d) => d.reviewerId.toString() === reviewerId,
    );
    if (alreadyReviewed) throw { status: 409, message: 'You have already reviewed this task.' };

    if (action === 'reject' && (!rejectionReasons || rejectionReasons.length === 0)) {
      throw { status: 400, message: 'rejectionReasons is required when action is "reject".' };
    }

    // Calcula o quórum virtual (votos atuais + o voto que está entrando)
    const currentDecisions = [...task.decisions, { action }];
    const approvals = currentDecisions.filter((d) => d.action === 'approve').length;
    const rejections = currentDecisions.filter((d) => d.action === 'reject').length;

    // Se o limite de votos for alcançado, resolvemos a tarefa
    let nextStatus: 'pending' | 'approved' | 'rejected' = 'pending';
    if (approvals >= QUORUM) nextStatus = 'approved';
    else if (rejections >= QUORUM) nextStatus = 'rejected';

    // Grava de forma atômica o voto e a atualização de status (caso haja) usando o repositório
    const updatedTask = await reviewsRepository.addDecisionAndUpdateStatus(
      taskId,
      { reviewerId, action, rejectionReasons },
      nextStatus
    );

    return {
      reviewId: updatedTask!.id,
      action,
      status: updatedTask!.status,
      reviewedAt: new Date().toISOString(),
    };
  }
};