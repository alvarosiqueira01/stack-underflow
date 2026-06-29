import { httpClient } from "@/lib/api/http-client";

interface ReviewQueue {
  id: string;
  type: string;
  label: string;
  description: string;
  pendingCount: number;
}

export async function getReviewQueues(): Promise<ReviewQueue[]> {
  const response = await httpClient.get<ReviewQueue[]>("/api/reviews");
  return response.data;
}
