import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const questionStatuses = ["open", "closed", "deleted"] as const;

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 10, maxlength: 150 },
    body: { type: String, required: true, minlength: 30 },
    expectedResult: { type: String, trim: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    tags: [{ type: Types.ObjectId, ref: "Tag", index: true }],
    voteCount: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    acceptedAnswerId: { type: Types.ObjectId, ref: "Answer" },
    status: { type: String, enum: questionStatuses, default: "open", index: true },
  },
  { timestamps: true },
);

QuestionSchema.index({ title: "text", body: "text" });
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ updatedAt: -1 });
QuestionSchema.index({ voteCount: -1 });

export type Question = InferSchemaType<typeof QuestionSchema>;

export const QuestionModel =
  (models.Question as Model<Question> | undefined) ??
  model<Question>("Question", QuestionSchema);
