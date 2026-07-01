import { httpClient } from "@/lib/api/http-client";
import type { Answer, Comment, Question, VoteValue } from "../types";

export interface PaginatedQuestions {
  data: Question[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
  sort?: string;
}

export async function getQuestions(params: GetQuestionsParams): Promise<PaginatedQuestions> {
  const response = await httpClient.get<PaginatedQuestions>("/api/questions", { params });

  return response.data;
}

export async function getQuestion(questionId: string): Promise<Question> {
  const response = await httpClient.get<Question>(`/api/questions/${questionId}`);
  return response.data;
}

export async function getAnswers(questionId: string): Promise<Answer[]> {
  const response = await httpClient.get<Answer[]>(`/api/questions/${questionId}/answers`);
  return response.data;
}

export async function voteQuestion(questionId: string, value: VoteValue) {
  const response = await httpClient.post<{ votes: number; userVote: VoteValue }>(
    `/api/questions/${questionId}/vote`,
    { value },
  );
  return response.data;
}

export async function voteAnswer(answerId: string, value: VoteValue) {
  const response = await httpClient.post<{ votes: number; userVote: VoteValue }>(
    `/api/answers/${answerId}/vote`,
    { value },
  );
  return response.data;
}

export async function postAnswer(questionId: string, body: string): Promise<Answer> {
  const response = await httpClient.post<Answer>(`/api/questions/${questionId}/answers`, {
    body,
  });
  return response.data;
}

export async function acceptAnswer(answerId: string): Promise<Answer> {
  const response = await httpClient.post<Answer>(`/api/answers/${answerId}/accept`);
  return response.data;
}

export async function getQuestionComments(questionId: string): Promise<Comment[]> {
  const response = await httpClient.get<Comment[]>(`/api/questions/${questionId}/comments`);
  return response.data;
}

export async function getAnswerComments(answerId: string): Promise<Comment[]> {
  const response = await httpClient.get<Comment[]>(`/api/answers/${answerId}/comments`);
  return response.data;
}

export async function postQuestionComment(questionId: string, body: string): Promise<Comment> {
  const response = await httpClient.post<Comment>(`/api/questions/${questionId}/comments`, {
    body,
  });
  return response.data;
}

export async function postAnswerComment(answerId: string, body: string): Promise<Comment> {
  const response = await httpClient.post<Comment>(`/api/answers/${answerId}/comments`, {
    body,
  });
  return response.data;
}
