import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const reviewTypes = ["suggested_edit", "flag"] as const;
export const reviewTargetTypes = ["question", "answer", "comment"] as const;
export const reviewStatuses = ["pending", "approved", "rejected", "skipped"] as const;

const ReviewSchema = new Schema(
  {
    type: { type: String, enum: reviewTypes, required: true, index: true },
    targetType: {
      type: String,
      enum: reviewTargetTypes,
      required: true,
      index: true,
    },
    targetId: { type: Types.ObjectId, required: true, index: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    beforeContent: { type: String },
    afterContent: { type: String },
    editSummary: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: reviewStatuses, default: "pending", index: true },
    reviewerId: { type: Types.ObjectId, ref: "User" },
    rejectReason: { type: String, trim: true, maxlength: 255 },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

ReviewSchema.index({ status: 1, type: 1, createdAt: 1 });

export type Review = InferSchemaType<typeof ReviewSchema>;

export const ReviewModel =
  (models.Review as Model<Review> | undefined) ??
  model<Review>("Review", ReviewSchema);
