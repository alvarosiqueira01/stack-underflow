import type { SortOrder } from "mongoose";

import {
  getPagination,
  type PaginationOptions,
} from "./pagination";
import { QuestionModel, type Question } from "../models/questions.model";
// Garante que o schema "Tag" esteja registrado no Mongoose antes do populate('tags') abaixo.
import "../models/tags.model";

type CreateQuestionData = Pick<Question, "title" | "body" | "authorId" | "tags"> &
  Partial<Pick<Question, "expectedResult">>;

type UpdateQuestionData = Partial<
  Pick<Question, "title" | "body" | "expectedResult" | "tags" | "status">
>;

type ListQuestionsOptions = PaginationOptions & {
  search?: string;
  tagId?: string;
  status?: Question["status"];
  authorId?: string;
  sort?: "newest" | "active" | "votes" | "unanswered";
  limit?: number;
};

export const questionsRepository = {
  create(data: CreateQuestionData) {
    return QuestionModel.create(data);
  },

  findById(id: string) {
    return QuestionModel.findById(id)
      .populate({
        path: "authorId",
        select: "name username avatarUrl reputation",
      })
      .populate({
        path: "tags",
        select: "name",
      })
      .exec();
  },

  list(options: ListQuestionsOptions = {}) {
    const { limit, skip } = getPagination(options);
    const filter: Record<string, unknown> = {};

    if (options.search) {
      filter.$text = { $search: options.search };
    }

    if (options.tagId) {
      filter.tags = options.tagId;
    }

    if (options.status) {
      filter.status = options.status;
    }

    if (options.sort === "unanswered") {
      filter.answerCount = 0;
    }

    const sort: Record<string, SortOrder> =
      options.sort === "votes"
        ? { voteCount: -1 }
        : options.sort === "active"
          ? { updatedAt: -1 }
          : { createdAt: -1 };

    return QuestionModel.find(filter)
      .populate({
        path: "authorId",
        select: "name username avatarUrl reputation",
      })
      .populate({
        path: "tags",
        select: "name",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  },

  count(options: Pick<ListQuestionsOptions, "search" | "tagId" | "status" | "authorId"> = {}) {
    const filter: Record<string, unknown> = {};

    if (options.search) {
      filter.$text = { $search: options.search };
    }

    if (options.tagId) {
      filter.tags = options.tagId;
    }

    if (options.status) {
      filter.status = options.status;
    }

    return QuestionModel.countDocuments(filter).exec();
  },


  updateById(id: string, data: UpdateQuestionData) {
    return QuestionModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  },

  deleteById(id: string) {
    return QuestionModel.findByIdAndDelete(id).exec();
  },

  incrementViews(id: string) {
    return QuestionModel.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true },
    )
      .populate('authorId', 'name username avatarUrl reputation')
      .populate('tags', 'name')
      .exec();
  },

  updateVoteCount(id: string, value: number) {
    return QuestionModel.findByIdAndUpdate(
      id,
      { $inc: { voteCount: value } },
      { new: true },
    ).exec();
  },

  updateAnswerCount(id: string, value: number) {
    return QuestionModel.findByIdAndUpdate(
      id,
      { $inc: { answerCount: value } },
      { new: true },
    ).exec();
  },

  setAcceptedAnswer(questionId: string, answerId: string) {
    return QuestionModel.findByIdAndUpdate(
      questionId,
      { $set: { acceptedAnswerId: answerId } },
      { new: true },
    ).exec();
  },

  closeQuestion(
    questionId: string,
    reason: string
  ) {
    return QuestionModel.findByIdAndUpdate(
      questionId,
      {
        $set: {
          status: "closed",
          closeReason: reason
        }
      },
      { new: true }
    ).exec();
  },

  listTopTags(limit: number) {
    return QuestionModel.aggregate<{ _id: string; count: number }>([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]).exec();
  }
};
