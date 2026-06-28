import { useMutation } from "@tanstack/react-query";
import { postAnswerComment, postQuestionComment } from "../api/questions.api";

// A API não expõe um GET para listar comentários — só criação.
// Por isso essas mutations não invalidam nenhuma query; quem chama
// é responsável por anexar o comentário retornado ao estado local.

export function usePostQuestionComment(questionId: string) {
  return useMutation({
    mutationFn: (body: string) => postQuestionComment(questionId, body),
  });
}

export function usePostAnswerComment() {
  return useMutation({
    mutationFn: ({ answerId, body }: { answerId: string; body: string }) =>
      postAnswerComment(answerId, body),
  });
}
