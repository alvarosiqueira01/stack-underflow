"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostQuestionComment } from "@/features/questions/hooks/use-post-comment";
import { useVoteQuestion } from "@/features/questions/hooks/use-vote-question";
import type { Comment, Question } from "@/features/questions/types";
import { QuestionDetailsSectionBody } from "./question-details-section-body";
import { QuestionDetailsSectionHeader } from "./question-details-section-header";

type Props = {
  question: Question;
};

export function QuestionDetailsSection({ question }: Props) {
  const router = useRouter();
  const voteQuestion = useVoteQuestion(question.id);
  const postComment = usePostQuestionComment(question.id);
  // A API ainda não expõe um GET para listar comentários de uma pergunta —
  // só o POST de criação. Mantemos os comentários enviados nesta sessão aqui.
  const [comments, setComments] = useState<Comment[]>([]);

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
        votes={question.votes}
        userVote={question.userVote}
        body={question.body}
        tags={question.tags}
        author={question.author}
        createdAt={question.createdAt}
        comments={comments}
        onVote={(value) => voteQuestion.mutate(value)}
        onShare={() => navigator.clipboard.writeText(window.location.href)}
        onEdit={() => router.push(`/questions/${question.id}/edit`)}
        onFollow={() => {}}
        onFlag={() => {}}
        onComment={(text) =>
          postComment.mutate(text, {
            onSuccess: (comment) => setComments((prev) => [...prev, comment]),
          })
        }
      />
    </section>
  );
}
