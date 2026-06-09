import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const userRoles = ["user", "moderator", "admin"] as const;

const BadgeCountsSchema = new Schema(
  {
    gold: { type: Number, default: 0, min: 0 },
    silver: { type: Number, default: 0, min: 0 },
    bronze: { type: Number, default: 0, min: 0 },
  },
  { _id: false },
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },
    location: { type: String, trim: true, maxlength: 120 },
    website: { type: String, trim: true, maxlength: 255 },
    reputation: { type: Number, default: 0, min: 0 },
    role: { type: String, enum: userRoles, default: "user" },
    badges: { type: BadgeCountsSchema, default: () => ({}) },
    topTags: [{ type: Types.ObjectId, ref: "Tag" }],
  },
  { timestamps: true },
);

UserSchema.index({ name: "text", username: "text" });

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel =
  (models.User as Model<User> | undefined) ?? model<User>("User", UserSchema);
