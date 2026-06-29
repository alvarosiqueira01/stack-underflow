import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptAnswer } from "../api/questions.api";

export function useAcceptAnswer(questionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string) => acceptAnswer(answerId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["answers", questionId] }),
  });
}
