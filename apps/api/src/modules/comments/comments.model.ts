import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const commentTargetTypes = ["question", "answer"] as const;
export const commentStatuses = ["visible", "deleted"] as const;

const CommentSchema = new Schema(
  {
    body: { type: String, required: true, trim: true, minlength: 1, maxlength: 1_000 },
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: commentTargetTypes, required: true },
    targetId: { type: Types.ObjectId, required: true, index: true },
    status: { type: String, enum: commentStatuses, default: "visible", index: true },
  },
  { timestamps: true },
);

CommentSchema.index({ targetType: 1, targetId: 1, createdAt: 1 });

export type Comment = InferSchemaType<typeof CommentSchema>;

export const CommentModel =
  (models.Comment as Model<Comment> | undefined) ??
  model<Comment>("Comment", CommentSchema);
