import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteQuestion } from "../api/questions.api";
import type { VoteValue } from "../types";

export function useVoteQuestion(questionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: VoteValue) => voteQuestion(questionId, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["question", questionId] }),
  });
}
