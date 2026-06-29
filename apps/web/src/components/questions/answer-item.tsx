"use client";

import { useState } from "react";
import { useRequireAuth } from "@/features/auth/hooks/use-require-auth";
import { usePostAnswerComment } from "@/features/questions/hooks/use-post-comment";
import type { Answer, Comment, VoteValue } from "@/features/questions/types";
import { AuthorCard } from "./author-card";
import { CommentList } from "./comment-list";
import { PostActions } from "./post-actions";
import { VoteControl } from "./vote-control";

type Props = {
  answer: Answer;
  isAuthenticated: boolean;
  isQuestionAuthor: boolean;
  onVote: (value: VoteValue) => void;
  onAccept: () => void;
};

export function AnswerItem({ answer, isAuthenticated, isQuestionAuthor, onVote, onAccept }: Props) {
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const postComment = usePostAnswerComment();
  const requireAuth = useRequireAuth();

  return (
    <div className="flex gap-4 border-b py-6">
      <VoteControl
        votes={answer.votes}
        userVote={answer.userVote}
        isAccepted={answer.isAccepted}
        onVote={(value) => requireAuth(() => onVote(value))}
      />

      <div className="flex-1 space-y-4">
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-zinc-800">
          {answer.body}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PostActions
              onShare={() => navigator.clipboard.writeText(window.location.href)}
              onEdit={() => requireAuth(() => {})}
              onFlag={() => requireAuth(() => {})}
            />
            {isAuthenticated && isQuestionAuthor && (
              <button
                type="button"
                onClick={onAccept}
                className="text-sm text-green-600 hover:underline"
              >
                {answer.isAccepted ? "Unaccept" : "Accept"}
              </button>
            )}
          </div>

          <AuthorCard author={answer.author} label="answered" timestamp={answer.createdAt} />
        </div>

        <CommentList
          comments={comments}
          isFormOpen={isCommentFormOpen}
          onToggleForm={() => requireAuth(() => setIsCommentFormOpen(true))}
          onSubmit={(text) =>
            requireAuth(() => {
              postComment.mutate(
                { answerId: answer.id, body: text },
                { onSuccess: (comment) => setComments((prev) => [...prev, comment]) },
              );
              setIsCommentFormOpen(false);
            })
          }
        />
      </div>
    </div>
  );
}
