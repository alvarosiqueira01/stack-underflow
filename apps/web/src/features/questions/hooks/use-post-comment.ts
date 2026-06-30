import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAnswerComment, postQuestionComment } from "../api/questions.api";

export function usePostQuestionComment(questionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => postQuestionComment(questionId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", "question", questionId] }),
  });
}

export function usePostAnswerComment(answerId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => postAnswerComment(answerId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", "answer", answerId] }),
  });
}
