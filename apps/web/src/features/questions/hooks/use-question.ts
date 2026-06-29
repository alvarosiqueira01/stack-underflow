import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../api/questions.api";

export function useQuestion(questionId: string) {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });
}
