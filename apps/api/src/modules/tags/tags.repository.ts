import type { SortOrder } from "mongoose";

import {
  getPagination,
  type PaginationOptions,
} from "../../common/repositories/pagination";
import { TagModel, type Tag } from "./tags.model";

type CreateTagData = Pick<Tag, "name" | "slug"> & Partial<Pick<Tag, "description">>;

type ListTagsOptions = PaginationOptions & {
  search?: string;
  sort?: "popular" | "name" | "newest";
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const tagsRepository = {
  create(data: CreateTagData) {
    return TagModel.create(data);
  },

  findById(id: string) {
    return TagModel.findById(id).exec();
  },

  findBySlug(slug: string) {
    return TagModel.findOne({ slug }).exec();
  },

  findOrCreateByName(name: string) {
    const normalizedName = name.trim().toLowerCase();
    const slug = slugify(normalizedName);

    return TagModel.findOneAndUpdate(
      { slug },
      { $setOnInsert: { name: normalizedName, slug } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
  },

  list(options: ListTagsOptions = {}) {
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
          : { totalQuestions: -1 };

    return TagModel.find(filter).sort(sort).skip(skip).limit(limit).exec();
  },

  listPopular(limit = 10) {
    return TagModel.find({}).sort({ totalQuestions: -1 }).limit(limit).exec();
  },

  incrementQuestionCount(tagIds: string[], amount = 1) {
    return TagModel.updateMany(
      { _id: { $in: tagIds } },
      { $inc: { totalQuestions: amount } },
    ).exec();
  },
};
