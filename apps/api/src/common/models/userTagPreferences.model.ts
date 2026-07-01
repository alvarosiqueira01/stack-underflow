import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const tagPreferenceStatuses = ["watching", "ignoring"] as const;

const UserTagPreferenceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    tagId: { type: Types.ObjectId, ref: "Tag", required: true, index: true },
    status: {
      type: String,
      enum: tagPreferenceStatuses,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

UserTagPreferenceSchema.index({ userId: 1, tagId: 1 }, { unique: true });

export type UserTagPreference = InferSchemaType<typeof UserTagPreferenceSchema>;

export const UserTagPreferenceModel =
  (models.UserTagPreference as Model<UserTagPreference> | undefined) ??
  model<UserTagPreference>("UserTagPreference", UserTagPreferenceSchema);
