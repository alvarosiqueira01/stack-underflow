import {
  BadgeModel,
  UserBadgeModel,
  type Badge,
  type badgeTiers,
} from "./badges.model";

type BadgeTier = (typeof badgeTiers)[number];
type CreateBadgeData = Pick<Badge, "name" | "slug" | "tier" | "description">;

export const badgesRepository = {
  createBadge(data: CreateBadgeData) {
    return BadgeModel.create(data);
  },

  findBadgeBySlug(slug: string) {
    return BadgeModel.findOne({ slug }).exec();
  },

  listBadges(tier?: BadgeTier) {
    return BadgeModel.find(tier ? { tier } : {}).sort({ tier: 1, name: 1 }).exec();
  },

  awardBadge(userId: string, badgeId: string) {
    return UserBadgeModel.findOneAndUpdate(
      { userId, badgeId },
      { $setOnInsert: { userId, badgeId, earnedAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
  },

  findUserBadges(userId: string) {
    return UserBadgeModel.find({ userId }).populate("badgeId").exec();
  },
};
