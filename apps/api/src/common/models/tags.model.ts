import {
  Schema,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

const TagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 60,
    },
    description: { type: String, trim: true, maxlength: 500 },
    totalQuestions: { type: Number, default: 0, min: 0 },
    questionsToday: { type: Number, default: 0, min: 0 },
    questionsThisWeek: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

TagSchema.index({ name: "text", description: "text" });
TagSchema.index({ totalQuestions: -1 });

export type Tag = InferSchemaType<typeof TagSchema>;

export const TagModel =
  (models.Tag as Model<Tag> | undefined) ?? model<Tag>("Tag", TagSchema);
