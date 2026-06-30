import { useQuery } from "@tanstack/react-query";
import { getAnswerComments } from "../api/questions.api";

export function useAnswerComments(answerId: string) {
  return useQuery({
    queryKey: ["comments", "answer", answerId],
    queryFn: () => getAnswerComments(answerId),
  });
}
