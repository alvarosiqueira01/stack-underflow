import type { SortOrder } from "mongoose";

import {
  getPagination,
  type PaginationOptions,
} from "../../common/repositories/pagination";
import { UserModel, type User } from "./users.model";

type CreateUserData = Pick<User, "name" | "username" | "email" | "passwordHash"> &
  Partial<Pick<User, "avatarUrl" | "bio" | "location" | "website">>;

type UpdateUserProfileData = Partial<
  Pick<User, "name" | "avatarUrl" | "bio" | "location" | "website" | "topTags">
>;

type ListUsersOptions = PaginationOptions & {
  search?: string;
  sort?: "reputation" | "newest" | "name";
};

export const usersRepository = {
  create(data: CreateUserData) {
    return UserModel.create(data);
  },

  findById(id: string) {
    return UserModel.findById(id).exec();
  },

  findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).exec();
  },

  findByUsername(username: string) {
    return UserModel.findOne({ username: username.toLowerCase() }).exec();
  },

  list(options: ListUsersOptions = {}) {
    const { limit, skip } = getPagination(options);
    const filter: Record<string, unknown> = {};

    if (options.search) {
      filter.$text = { $search: options.search };
    }

    const sort: Record<string, SortOrder> =
      options.sort === "name"
        ? { name: 1 }
        : options.sort === "newest"
          ? { createdAt: -1 }
          : { reputation: -1 };

    return UserModel.find(filter).sort(sort).skip(skip).limit(limit).exec();
  },

  count(options: Pick<ListUsersOptions, "search"> = {}) {
    const filter: Record<string, unknown> = {};

    if (options.search) {
      filter.$text = { $search: options.search };
    }

    return UserModel.countDocuments(filter).exec();
  },

  updateProfile(userId: string, data: UpdateUserProfileData) {
    return UserModel.findByIdAndUpdate(userId, { $set: data }, { new: true }).exec();
  },

  incrementReputation(userId: string, points: number) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $inc: { reputation: points } },
      { new: true },
    ).exec();
  },
};
