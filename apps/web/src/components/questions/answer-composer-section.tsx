"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { extractErrorMessage } from "@/lib/api/extract-error-message";
import { loginHref } from "@/features/auth/utils/login-href";
import { usePostAnswer } from "@/features/questions/hooks/use-post-answer";
import { AnswerComposerContent } from "./answer-composer-content";
import { AnswerComposerHeader } from "./answer-composer-header";

const MIN_BODY_LENGTH = 30;

type Props = {
  questionId: string;
  isAuthenticated: boolean;
};

export function AnswerComposerSection({ questionId, isAuthenticated }: Props) {
  const [draftBody, setDraftBody] = useState("");
  const pathname = usePathname();
  const postAnswer = usePostAnswer(questionId);

  const tooShort = draftBody.trim().length > 0 && draftBody.trim().length < MIN_BODY_LENGTH;

  function handleSubmit() {
    if (tooShort || draftBody.trim().length === 0) return;
    postAnswer.mutate(draftBody, {
      onSuccess: () => setDraftBody(""),
    });
  }

  const errorMessage = tooShort
    ? `A resposta precisa ter pelo menos ${MIN_BODY_LENGTH} caracteres (tem ${draftBody.trim().length}).`
    : postAnswer.isError
      ? extractErrorMessage(postAnswer.error, "Não foi possível enviar sua resposta. Tente novamente.")
      : null;

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
        loginHref={loginHref(pathname)}
        registerHref={loginHref(pathname, "register")}
        onBodyChange={setDraftBody}
      />

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </section>
  );
}
