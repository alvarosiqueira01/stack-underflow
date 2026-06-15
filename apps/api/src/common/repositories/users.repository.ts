import { Types, type SortOrder, type PipelineStage } from "mongoose";

import {
  getPagination,
  type PaginationOptions,
} from "./pagination";
import { UserModel, type User } from "../models/users.model";
import { QuestionModel } from "../models/questions.model";

type CreateUserData = Pick<User, "name" | "username" | "email" | "passwordHash"> &
  Partial<Pick<User, "avatarUrl" | "bio" | "location" | "website">>;

type UpdateUserProfileData = Partial<
  Pick<User, "name" | "avatarUrl" | "bio" | "location" | "website" | "topTags">
>;

type ListUsersOptions = PaginationOptions & {
  search?: string;
  sort?: "reputation" | "newest" | "name";
  limit?: number;
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

  findByEmailOrUsername(
    email: string,
    username: string,
  ) {
    return UserModel.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    }).exec();
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

  getActivityFeed(userId: string, options: PaginationOptions) {
    const { limit, skip } = getPagination(options);
    const userObjectId = new Types.ObjectId(userId);

    const activityPipeline = [
      { $match: { _id: userObjectId } },
      // Traz as perguntas criadas pelo usuário
      {
        $lookup: {
          from: 'questions',
          localField: '_id',
          foreignField: 'authorId',
          as: 'questionsActivity'
        }
      },
      // Traz as respostas criadas pelo usuário
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'authorId',
          as: 'answersActivity'
        }
      },
      // Transforma o array mapeado de perguntas para o formato padrão do Feed
      {
        $project: {
          allActivity: {
            $concatArrays: [
              {
                $map: {
                  input: '$questionsActivity',
                  as: 'q',
                  in: {
                    id: '$$q._id',
                    type: 'question_posted',
                    title: '$$q.title',
                    createdAt: '$$q.createdAt'
                  }
                }
              },
              {
                $map: {
                  input: '$answersActivity',
                  as: 'a',
                  in: {
                    id: '$$a._id',
                    type: 'answer_posted',
                    title: 'Posted an answer', // Respostas emulando metadados de texto
                    createdAt: '$$a.createdAt'
                  }
                }
              },
              {
                $map: {
                  input: { $ifNull: ['$badgesEarned', []] }, // Evita quebra se não houver badges ainda
                  as: 'b',
                  in: {
                    id: '$$b._id',
                    type: 'badge_earned',
                    title: { $concat: ['Earned ', '$$b.name', ' medal'] },
                    createdAt: '$$b.earnedAt'
                  }
                }
              }
            ]
          }
        }
      },
      { $unwind: '$allActivity' },
      { $replaceRoot: { newRoot: '$allActivity' } },
      { $sort: { createdAt: -1 } }, // Garante a ordem cronológica invertida (mais recente primeiro)
      { $skip: skip },
      { $limit: limit }
    ] as PipelineStage[];

    return UserModel.aggregate(activityPipeline).exec();
  },

  getDashboardStats(userId: string) {
    const userObjectId = new Types.ObjectId(userId);

    return UserModel.aggregate([
      { $match: { _id: userObjectId } },
      {
        $lookup: {
          from: "questions", // Nome da coleção no MongoDB
          localField: "_id",
          foreignField: "authorId",
          as: "userQuestions",
        },
      },
      {
        $lookup: {
          from: "answers", // Nome da coleção no MongoDB
          localField: "_id",
          foreignField: "authorId",
          as: "userAnswers",
        },
      },
      {
        $project: {
          reputation: 1,
          badges: { $ifNull: ["$badges", { gold: 0, silver: 0, bronze: 0 }] },
          topTags: 1,
          counts: {
            questions: { $size: "$userQuestions" },
            answers: { $size: "$userAnswers" },
            acceptedAnswers: {
              $size: {
                $filter: {
                  input: "$userAnswers",
                  as: "ans",
                  cond: { $eq: ["$$ans.isAccepted", true] },
                },
              },
            },
            acceptanceRate: {
              $cond: [
                { $gt: [{ $size: "$userAnswers" }, 0] },
                {
                  $multiply: [
                    {
                      $divide: [
                        { $size: { $filter: { input: "$userAnswers", as: "ans", cond: { $eq: ["$$ans.isAccepted", true] } } } },
                        { $size: "$userAnswers" }
                      ]
                    },
                    100
                  ]
                },
                0
              ]
            },
          },
          topTagsAgregation: {
            $slice: [
              {
                $map: {
                  input: { $slice: ["$topTags", 5] },
                  as: "tagId",
                  in: {
                    tagId: "$$tagId",
                    count: {
                      $size: {
                        $filter: {
                          input: "$userQuestions",
                          as: "q",
                          cond: { $in: ["$$tagId", "$$q.tags"] },
                        },
                      },
                    },
                  },
                },
              },
              5,
            ],
          },
        },
      },
    ]).exec();
  },
};
