"use client";

import { AppShell } from "../layout/app-shell";
import { useAnswers } from "@/features/questions/hooks/use-answers";
import { useQuestion } from "@/features/questions/hooks/use-question";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { AnswerComposerSection } from "./answer-composer-section";
import { AnswersSection } from "./answers-section";
import { QuestionDetailsPageError } from "./question-details-page-error";
import { QuestionDetailsPageSkeleton } from "./question-details-page-skeleton";
import { QuestionDetailsSection } from "./question-details-section";

type Props = {
  questionId: string;
};

export function QuestionDetailsPage({ questionId }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = user !== null;

  const questionQuery = useQuestion(questionId);
  const answersQuery = useAnswers(questionId);

  const status = questionQuery.isError
    ? "error"
    : questionQuery.isPending
      ? "loading"
      : "success";

  return (
    <AppShell authenticated={isAuthenticated}>
      {status === "loading" && <QuestionDetailsPageSkeleton />}

      {status === "error" && (
        <QuestionDetailsPageError
          message="We couldn't load this question. Please try again."
          onRetry={() => questionQuery.refetch()}
        />
      )}

      {status === "success" && questionQuery.data && (
        <>
          <QuestionDetailsSection question={questionQuery.data} />

          <AnswersSection
            questionId={questionId}
            answers={answersQuery.data ?? []}
            isAuthenticated={isAuthenticated}
            isQuestionAuthor={isAuthenticated && user?.id === questionQuery.data.author.id}
          />

          <AnswerComposerSection questionId={questionId} isAuthenticated={isAuthenticated} />
        </>
      )}
    </AppShell>
  );
}
