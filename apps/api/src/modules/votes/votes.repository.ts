import { Types } from "mongoose";

import { VoteModel, type voteTargetTypes, type voteValues } from "./votes.model";

type VoteTargetType = (typeof voteTargetTypes)[number];
type VoteValue = (typeof voteValues)[number];

export const votesRepository = {
  findUserVote(userId: string, targetType: VoteTargetType, targetId: string) {
    return VoteModel.findOne({ userId, targetType, targetId }).exec();
  },

  upsertVote(
    userId: string,
    targetType: VoteTargetType,
    targetId: string,
    value: VoteValue,
  ) {
    return VoteModel.findOneAndUpdate(
      { userId, targetType, targetId },
      { $set: { value } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
  },

  deleteVote(userId: string, targetType: VoteTargetType, targetId: string) {
    return VoteModel.findOneAndDelete({ userId, targetType, targetId }).exec();
  },

  async sumVotes(targetType: VoteTargetType, targetId: string): Promise<number> {
    const [result] = await VoteModel.aggregate<{ total: number }>([
      { $match: { targetType, targetId: new Types.ObjectId(targetId) } },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]).exec();

    return result?.total ?? 0;
  },
};
