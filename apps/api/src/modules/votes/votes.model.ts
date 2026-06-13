import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const voteTargetTypes = ["question", "answer"] as const;
export const voteValues = [-1, 1] as const;

const VoteSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    targetType: { type: String, enum: voteTargetTypes, required: true },
    targetId: { type: Types.ObjectId, required: true, index: true },
    value: { type: Number, enum: voteValues, required: true },
  },
  { timestamps: true },
);

VoteSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });
VoteSchema.index({ targetType: 1, targetId: 1 });

export type Vote = InferSchemaType<typeof VoteSchema>;

export const VoteModel =
  (models.Vote as Model<Vote> | undefined) ?? model<Vote>("Vote", VoteSchema);
