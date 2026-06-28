"use client";

import { useMemo, useState } from "react";
import { useAcceptAnswer } from "@/features/questions/hooks/use-accept-answer";
import { useVoteAnswer } from "@/features/questions/hooks/use-vote-answer";
import type { Answer, VoteValue } from "@/features/questions/types";
import { AnswersSectionBody } from "./answers-section-body";
import { AnswersSectionHeader, type AnswerSortBy } from "./answers-section-header";

type Props = {
  questionId: string;
  answers: Answer[];
  isAuthenticated: boolean;
  isQuestionAuthor: boolean;
};

export function AnswersSection({ questionId, answers, isAuthenticated, isQuestionAuthor }: Props) {
  const [sortBy, setSortBy] = useState<AnswerSortBy>("votes");
  const voteAnswer = useVoteAnswer(questionId);
  const acceptAnswer = useAcceptAnswer(questionId);

  const sortedAnswers = useMemo(() => {
    const list = [...answers];
    list.sort((a, b) => {
      if (a.isAccepted !== b.isAccepted) return a.isAccepted ? -1 : 1;
      if (sortBy === "votes") return b.votes - a.votes;
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortBy === "newest" ? bTime - aTime : aTime - bTime;
    });
    return list;
  }, [answers, sortBy]);

  return (
    <section className="mt-6">
      <AnswersSectionHeader answerCount={answers.length} sortBy={sortBy} onSortChange={setSortBy} />

      <AnswersSectionBody
        answers={sortedAnswers}
        isAuthenticated={isAuthenticated}
        isQuestionAuthor={isQuestionAuthor}
        onVote={(answerId, value: VoteValue) => {
          if (value !== 0) voteAnswer.mutate({ answerId, value });
        }}
        onAccept={(answerId) => acceptAnswer.mutate(answerId)}
      />
    </section>
  );
}
