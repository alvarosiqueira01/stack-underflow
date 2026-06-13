import {
  ReviewModel,
  type Review,
  type reviewStatuses,
  type reviewTypes,
} from "./reviews.model";

type ReviewType = (typeof reviewTypes)[number];
type ReviewStatus = (typeof reviewStatuses)[number];

type CreateReviewData = Pick<
  Review,
  "type" | "targetType" | "targetId" | "authorId"
> &
  Partial<Pick<Review, "beforeContent" | "afterContent" | "editSummary">>;

type FindPendingOptions = {
  type?: ReviewType;
  limit?: number;
};

export const reviewsRepository = {
  create(data: CreateReviewData) {
    return ReviewModel.create(data);
  },

  findById(id: string) {
    return ReviewModel.findById(id).exec();
  },

  findPending(options: FindPendingOptions = {}) {
    return ReviewModel.find({
      status: "pending",
      ...(options.type ? { type: options.type } : {}),
    })
      .sort({ createdAt: 1 })
      .limit(options.limit ?? 20)
      .exec();
  },

  countPendingByType() {
    return ReviewModel.aggregate<{ _id: ReviewType; count: number }>([
      { $match: { status: "pending" } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]).exec();
  },

  setDecision(
    reviewId: string,
    reviewerId: string,
    status: Exclude<ReviewStatus, "pending">,
    rejectReason?: string,
  ) {
    const decisionData: Record<string, unknown> = {
      status,
      reviewerId,
      reviewedAt: new Date(),
    };

    if (rejectReason) {
      decisionData.rejectReason = rejectReason;
    }

    return ReviewModel.findByIdAndUpdate(
      reviewId,
      { $set: decisionData },
      { new: true },
    ).exec();
  },
};
