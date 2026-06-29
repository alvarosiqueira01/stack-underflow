import type { Answer, VoteValue } from "@/features/questions/types";
import { AnswerItem } from "./answer-item";

type Props = {
  answers: Answer[];
  isAuthenticated: boolean;
  isQuestionAuthor: boolean;
  onVote: (answerId: string, value: VoteValue) => void;
  onAccept: (answerId: string) => void;
};

export function AnswersSectionBody({
  answers,
  isAuthenticated,
  isQuestionAuthor,
  onVote,
  onAccept,
}: Props) {
  return (
    <div>
      {answers.map((answer) => (
        <AnswerItem
          key={answer.id}
          answer={answer}
          isAuthenticated={isAuthenticated}
          isQuestionAuthor={isQuestionAuthor}
          onVote={(value) => onVote(answer.id, value)}
          onAccept={() => onAccept(answer.id)}
        />
      ))}
    </div>
  );
}
