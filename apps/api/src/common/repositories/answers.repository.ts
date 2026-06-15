import type { SortOrder } from "mongoose";

import { AnswerModel, type Answer } from "../models/answers.model";
import { QuestionModel } from "../models/questions.model";
import { count } from "node:console";

type CreateAnswerData = Pick<Answer, "body" | "questionId" | "authorId">;
type UpdateAnswerData = Partial<Pick<Answer, "body" | "isAccepted">>;

type ListAnswersOptions = {
  sort?: "votes" | "newest" | "oldest";
  authorId?: string;
  isAccepted?: boolean;
  questionId?: string;
};

export const answersRepository = {
  create(data: CreateAnswerData) {
    return AnswerModel.create(data);
  },

  findById(id: string) {
    return AnswerModel.findById(id).exec();
  },

  findByQuestionId(questionId: string, options: ListAnswersOptions = {}) {
    const filter = { questionId };
    const sort: Record<string, SortOrder> =
      options.sort === "oldest"
        ? { createdAt: 1 }
        : options.sort === "newest"
          ? { createdAt: -1 }
          : { isAccepted: -1, voteCount: -1 };

    return AnswerModel.find(filter).sort(sort).exec();
  },

  findByAuthorAndQuestion(questionId: string, authorId: string) {
    return AnswerModel.findOne({ questionId, authorId }).exec();
  },

  updateById(id: string, data: UpdateAnswerData) {
    return AnswerModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  },

  deleteById(id: string) {
    return AnswerModel.findByIdAndDelete(id).exec();
  },

  count(filter: ListAnswersOptions = {}) {
    return AnswerModel.countDocuments(filter).exec();
  },

  existsByQuestionId(questionId: string) {
    return AnswerModel.exists({ questionId });
  },

  deleteByQuestionId(questionId: string) {
    return AnswerModel.deleteMany({ questionId });
  },

  updateVoteCount(id: string, value: number) {
    return AnswerModel.findByIdAndUpdate(
      id,
      { $inc: { voteCount: value } },
      { new: true },
    ).exec();
  },

  markAccepted(answerId: string) {
    return AnswerModel.findByIdAndUpdate(
      answerId,
      { $set: { isAccepted: true } },
      { new: true },
    ).exec();
  },

  unmarkAcceptedForQuestion(questionId: string) {
    return AnswerModel.updateMany(
      { questionId },
      { $set: { isAccepted: false } },
    ).exec();
  },

};
