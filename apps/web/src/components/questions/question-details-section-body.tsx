"use client";

import { useState } from "react";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { usePostQuestionComment } from "@/features/questions/hooks/use-post-comment";
import type { AuthorSummary, Comment, VoteValue } from "@/features/questions/types";
import { extractErrorMessage } from "@/lib/api/extract-error-message";
import { AuthorCard } from "./author-card";
import { Badge } from "../ui/badge";
import { CommentList } from "./comment-list";
import { PostActions } from "./post-actions";
import { VoteControl } from "./vote-control";

type Props = {
  questionId: string;
  votes: number;
  userVote: VoteValue | null;
  body: string;
  tags: string[];
  author: AuthorSummary;
  createdAt: string;
  comments: Comment[];
  onVote: (value: 1 | -1) => void;
  onShare: () => void;
  onEdit: () => void;
  onFollow: () => void;
  onFlag: () => void;
};

export function QuestionDetailsSectionBody({
  questionId,
  votes,
  userVote,
  body,
  tags,
  author,
  createdAt,
  comments,
  onVote,
  onShare,
  onEdit,
  onFollow,
  onFlag,
}: Props) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const requireAuth = useRequireAuth();
  const postComment = usePostQuestionComment(questionId);
  const user = useAuthStore((state) => state.user);
  // Sem login, o botão fica visível normalmente — clicar abre o popup de login,
  // não é um caso de "sem permissão". O aviso de reputação só vale pra quem já está logado.
  const canComment = !user || user.permissions.canComment;

  return (
    <div className="mt-4 flex gap-4 border-b border-zinc-200 pb-6">
      <VoteControl
        votes={votes}
        userVote={userVote}
        onVote={(value) => requireAuth(() => onVote(value))}
      />

      <div className="flex-1 space-y-4">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-zinc-800">{body}</div>

        <div className="flex gap-2">
          {tags.map((tag) => (
            <Badge key={tag} label={tag} href={`/questions?tag=${tag}`} />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <PostActions
            onShare={onShare}
            onEdit={() => requireAuth(onEdit)}
            onFollow={() => requireAuth(onFollow)}
            onFlag={() => requireAuth(onFlag)}
          />
          <AuthorCard author={author} label="asked" timestamp={createdAt} />
        </div>

        <CommentList
          comments={comments}
          isFormOpen={isCommentFormOpen}
          canComment={canComment}
          errorMessage={postComment.isError ? extractErrorMessage(postComment.error) : null}
          onToggleForm={() => requireAuth(() => setIsCommentFormOpen(true))}
          onSubmit={(text) =>
            requireAuth(() => {
              postComment.mutate(text, { onSuccess: () => setIsCommentFormOpen(false) });
            })
          }
        />
      </div>
    </div>
  );
}
