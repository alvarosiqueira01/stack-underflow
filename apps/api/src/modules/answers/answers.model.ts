import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const AnswerSchema = new Schema(
  {
    body: { type: String, required: true, minlength: 30 },
    questionId: { type: Types.ObjectId, ref: "Question", required: true, index: true },
    authorId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    voteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    isAccepted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

AnswerSchema.index({ questionId: 1, isAccepted: -1, voteCount: -1 });
AnswerSchema.index({ createdAt: -1 });

export type Answer = InferSchemaType<typeof AnswerSchema>;

export const AnswerModel =
  (models.Answer as Model<Answer> | undefined) ??
  model<Answer>("Answer", AnswerSchema);
