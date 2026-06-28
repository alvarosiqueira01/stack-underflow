import { useQuery } from "@tanstack/react-query";
import { getAnswers } from "../api/questions.api";

export function useAnswers(questionId: string) {
  return useQuery({
    queryKey: ["answers", questionId],
    queryFn: () => getAnswers(questionId),
  });
}
