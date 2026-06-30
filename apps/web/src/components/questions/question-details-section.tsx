"use client";

import { useRouter } from "next/navigation";
import { useQuestionComments } from "@/features/questions/hooks/use-question-comments";
import { useVoteQuestion } from "@/features/questions/hooks/use-vote-question";
import type { Question } from "@/features/questions/types";
import { QuestionDetailsSectionBody } from "./question-details-section-body";
import { QuestionDetailsSectionHeader } from "./question-details-section-header";

type Props = {
  question: Question;
};

export function QuestionDetailsSection({ question }: Props) {
  const router = useRouter();
  const voteQuestion = useVoteQuestion(question.id);
  const { data: comments } = useQuestionComments(question.id);

  return (
    <section>
      <QuestionDetailsSectionHeader
        breadcrumbs={[
          { label: "Questions", href: "/questions" },
          ...question.tags.slice(0, 2).map((tag) => ({ label: tag, href: `/questions?tag=${tag}` })),
        ]}
        title={question.title}
        createdAt={question.createdAt}
        updatedAt={question.updatedAt}
        viewsCount={question.viewsCount}
        onAskQuestion={() => router.push("/questions/ask")}
      />

      <QuestionDetailsSectionBody
        questionId={question.id}
        votes={question.votes}
        userVote={question.userVote}
        body={question.body}
        tags={question.tags}
        author={question.author}
        createdAt={question.createdAt}
        comments={comments ?? []}
        onVote={(value) => voteQuestion.mutate(value)}
        onShare={() => navigator.clipboard.writeText(window.location.href)}
        onEdit={() => router.push(`/questions/${question.id}/edit`)}
        onFollow={() => {}}
        onFlag={() => {}}
      />
    </section>
  );
}
