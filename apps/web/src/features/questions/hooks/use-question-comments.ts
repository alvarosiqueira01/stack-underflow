import { useQuery } from "@tanstack/react-query";
import { getQuestionComments } from "../api/questions.api";

export function useQuestionComments(questionId: string) {
  return useQuery({
    queryKey: ["comments", "question", questionId],
    queryFn: () => getQuestionComments(questionId),
  });
}
