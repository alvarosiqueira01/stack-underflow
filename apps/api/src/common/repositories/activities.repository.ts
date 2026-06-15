import {
  getPagination,
  type PaginationOptions,
} from "./pagination";
import { ActivityModel, type Activity } from "../models/activities.model";

type CreateActivityData = Pick<
  Activity,
  "userId" | "type" | "targetType" | "targetId"
> &
  Partial<Pick<Activity, "metadata">>;

export const activitiesRepository = {
  create(data: CreateActivityData) {
    return ActivityModel.create(data);
  },

  findByUser(userId: string, options: PaginationOptions = {}) {
    const { limit, skip } = getPagination(options);

    return ActivityModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  },
};
