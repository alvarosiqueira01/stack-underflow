import { httpClient } from "@/lib/api/http-client";

export interface DashboardStats {
  reputation: number;
  reputationThisMonth: number;
  questionsCount: number;
  answersCount: number;
  acceptedAnswersCount: number;
  acceptanceRate: number;
  upvotesReceived: number;
  badges: { gold: number; silver: number; bronze: number };
  recentBadges: any[];
  topTags: { tag: string; postsCount: number; score: number }[];
}

export interface TagPreferences {
  watchedTags: string[];
  ignoredTags: string[];
}


export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await httpClient.get('/api/users/me/dashboard');
    return data;
  },
  getTagPreferences: async (): Promise<TagPreferences> => {
    const { data } = await httpClient.get('/api/tags/preferences');
    return data;
  }
};