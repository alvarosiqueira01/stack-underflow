import { httpClient } from "@/lib/api/http-client";

export interface TagDetails {
  id: string;
  name: string;
  description: string;
  postsCount: number;
}

export interface UpdateTagPreferenceBody {
  status: "watching" | "ignored" | "none";
}

export async function getTagDetails(id: string): Promise<TagDetails> {
  const { data } = await httpClient.get(`/api/tags/${id}`);
  return data;
}

export async function updateTagPreference(id: string, status: "watching" | "ignored" | "none") {
  const { data } = await httpClient.post(`/api/tags/${id}/preference`, { status });
  return data;
}