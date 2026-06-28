"use client";

import { useState } from "react";
import { usePostAnswer } from "@/features/questions/hooks/use-post-answer";
import { AnswerComposerContent } from "./answer-composer-content";
import { AnswerComposerHeader } from "./answer-composer-header";

type Props = {
  questionId: string;
  isAuthenticated: boolean;
};

export function AnswerComposerSection({ questionId, isAuthenticated }: Props) {
  const [draftBody, setDraftBody] = useState("");
  const postAnswer = usePostAnswer(questionId);

  function handleSubmit() {
    if (draftBody.trim().length === 0) return;
    postAnswer.mutate(draftBody, {
      onSuccess: () => setDraftBody(""),
    });
  }

  return (
    <section className="mt-6 space-y-4">
      <AnswerComposerHeader
        isAuthenticated={isAuthenticated}
        isSubmitting={postAnswer.isPending}
        onSubmit={handleSubmit}
      />

      <AnswerComposerContent
        isAuthenticated={isAuthenticated}
        draftBody={draftBody}
        loginHref="/login"
        registerHref="/login"
        onBodyChange={setDraftBody}
      />
    </section>
  );
}
