import { CommentModel, type commentTargetTypes, type Comment } from "../models/comments.model";

type CommentTargetType = (typeof commentTargetTypes)[number];
type CreateCommentData = Pick<Comment, "body" | "authorId" | "targetType" | "targetId">;
type UpdateCommentData = Partial<Pick<Comment, "body" | "status">>;

export const commentsRepository = {
  create(data: CreateCommentData) {
    return CommentModel.create(data);
  },

  findById(id: string) {
    return CommentModel.findById(id).exec();
  },

  findByTarget(targetType: CommentTargetType, targetId: string) {
    return CommentModel.find({ targetType, targetId, status: "visible" })
      .sort({ createdAt: 1 })
      .exec();
  },

  updateById(id: string, data: UpdateCommentData) {
    return CommentModel.findByIdAndUpdate(id, { $set: data }, { new: true }).exec();
  },

  deleteById(id: string) {
    return CommentModel.findByIdAndUpdate(
      id,
      { $set: { status: "deleted" } },
      { new: true },
    ).exec();
  },
};
