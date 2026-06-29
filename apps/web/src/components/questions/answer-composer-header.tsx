import { Button } from "../ui/button";

type Props = {
  isAuthenticated: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

export function AnswerComposerHeader({ isAuthenticated, isSubmitting, onSubmit }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-zinc-900">Your Answer</h2>

      {isAuthenticated && (
        <div className="w-40">
          <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Your Answer"}
          </Button>
        </div>
      )}
    </div>
  );
}
