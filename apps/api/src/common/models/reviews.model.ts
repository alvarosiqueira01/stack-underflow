import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

// Unificamos as filas e os tipos (suggested_edit, close_vote, flag, etc.)
export const reviewTypes = ["suggested_edit", "close_vote", "low_quality_post", "flag"] as const;
export const reviewTargetTypes = ["question", "answer", "comment"] as const;
export const reviewStatuses = ["pending", "approved", "rejected", "skipped"] as const;
export const reviewActions = ["approve", "reject", "improve", "skip"] as const;
export const rejectionReasons = ["spam", "vandalism", "no_improvement", "irrelevant", "conflicts_with_author"] as const;

const ReviewDecisionSchema = new Schema(
  {
    reviewerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: reviewActions, required: true },
    rejectionReasons: { type: [String], enum: rejectionReasons },
    decidedAt: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

const ReviewSchema = new Schema(
  {
    type: { type: String, enum: reviewTypes, required: true, index: true },
    targetType: { type: String, enum: reviewTargetTypes, required: true, index: true },
    targetId: { type: Types.ObjectId, required: true, index: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true }, // Antigo submittedBy
    beforeContent: { type: String },
    afterContent: { type: String },
    editSummary: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: reviewStatuses, default: "pending", index: true },
    decisions: { type: [ReviewDecisionSchema], default: [] }, // Array substitui o reviewerId/rejectReason único
  },
  { timestamps: true },
);

ReviewSchema.index({ status: 1, type: 1, createdAt: 1 });

export type Review = InferSchemaType<typeof ReviewSchema>;

export const ReviewModel =
  (models.Review as Model<Review> | undefined) ??
  model<Review>("Review", ReviewSchema);