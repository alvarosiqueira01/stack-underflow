import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAnswer } from "../api/questions.api";

export function usePostAnswer(questionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => postAnswer(questionId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["answers", questionId] }),
  });
}
