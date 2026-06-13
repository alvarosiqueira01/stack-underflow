import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const activityTypes = [
  "question_created",
  "answer_created",
  "comment_created",
  "vote_received",
  "badge_earned",
] as const;

export const activityTargetTypes = ["question", "answer", "comment", "badge"] as const;

const ActivitySchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: activityTypes, required: true, index: true },
    targetType: { type: String, enum: activityTargetTypes, required: true },
    targetId: { type: Types.ObjectId, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

ActivitySchema.index({ userId: 1, createdAt: -1 });

export type Activity = InferSchemaType<typeof ActivitySchema>;

export const ActivityModel =
  (models.Activity as Model<Activity> | undefined) ??
  model<Activity>("Activity", ActivitySchema);
