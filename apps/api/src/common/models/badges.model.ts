import {
  Schema,
  Types,
  model,
  models,
  type InferSchemaType,
  type Model,
} from "mongoose";

export const badgeTiers = ["gold", "silver", "bronze"] as const;

const BadgeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
    },
    tier: { type: String, enum: badgeTiers, required: true, index: true },
    description: { type: String, required: true, trim: true, maxlength: 500 },
  },
  { timestamps: true },
);

const UserBadgeSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    badgeId: { type: Types.ObjectId, ref: "Badge", required: true, index: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export type Badge = InferSchemaType<typeof BadgeSchema>;
export type UserBadge = InferSchemaType<typeof UserBadgeSchema>;

export const BadgeModel =
  (models.Badge as Model<Badge> | undefined) ?? model<Badge>("Badge", BadgeSchema);

export const UserBadgeModel =
  (models.UserBadge as Model<UserBadge> | undefined) ??
  model<UserBadge>("UserBadge", UserBadgeSchema);
