import {
  ReviewModel,
  type Review,
  type reviewStatuses,
  type reviewTypes,
  type reviewActions,
} from "../models/reviews.model";

type ReviewType = (typeof reviewTypes)[number];
type ReviewStatus = (typeof reviewStatuses)[number];
type ReviewAction = (typeof reviewActions)[number];

type CreateReviewData = Pick<
  Review,
  "type" | "targetType" | "targetId" | "authorId"
> &
  Partial<Pick<Review, "beforeContent" | "afterContent" | "editSummary">>;

export const reviewsRepository = {
  create(data: CreateReviewData) {
    return ReviewModel.create(data);
  },

  findById(id: string) {
    // Popula o autor da submissão para exibição na UI
    return ReviewModel.findById(id).populate("authorId", "username").exec();
  },

  countPendingByType() {
    return ReviewModel.aggregate<{ _id: ReviewType; count: number }>([
      { $match: { status: "pending" } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]).exec();
  },

  // Nova função para registrar a decisão do revisor e atualizar o status geral simultaneamente
  addDecisionAndUpdateStatus(
    reviewId: string,
    decision: { reviewerId: string; action: ReviewAction; rejectionReasons?: string[] },
    newStatus: ReviewStatus
  ) {
    return ReviewModel.findByIdAndUpdate(
      reviewId,
      {
        $push: { decisions: decision },
        $set: { status: newStatus },
      },
      { new: true } // Retorna o documento já modificado
    ).exec();
  },
};