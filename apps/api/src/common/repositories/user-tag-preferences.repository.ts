import {
  UserTagPreferenceModel,
  type tagPreferenceStatuses,
} from "../models/user-tag-preferences.model";

type TagPreferenceStatus = (typeof tagPreferenceStatuses)[number];

export const userTagPreferencesRepository = {
  setPreference(userId: string, tagId: string, status: TagPreferenceStatus) {
    return UserTagPreferenceModel.findOneAndUpdate(
      { userId, tagId },
      { $set: { status } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
  },

  removePreference(userId: string, tagId: string) {
    return UserTagPreferenceModel.findOneAndDelete({ userId, tagId }).exec();
  },

  findByUser(userId: string) {
    return UserTagPreferenceModel.find({ userId }).populate("tagId").exec();
  },

  findStatus(userId: string, tagId: string) {
    return UserTagPreferenceModel.findOne({ userId, tagId }).exec();
  },
};
