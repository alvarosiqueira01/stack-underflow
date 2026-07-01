import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../api/questions.api";
import { getQuestions, GetQuestionsParams } from "../api/questions.api";

export function useQuestion(questionId: string) {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });
}

export function useQuestions(params: GetQuestionsParams) {
  return useQuery({
    queryKey: ["questions", "list", params],
    queryFn: () => getQuestions(params),
    // Mantém os dados da página anterior visíveis enquanto a nova página carrega
    placeholderData: (previousData) => previousData,
  });
}