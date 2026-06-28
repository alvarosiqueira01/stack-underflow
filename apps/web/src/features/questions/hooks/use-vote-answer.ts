import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteAnswer } from "../api/questions.api";
import type { VoteValue } from "../types";

export function useVoteAnswer(questionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId, value }: { answerId: string; value: VoteValue }) =>
      voteAnswer(answerId, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["answers", questionId] }),
  });
}
