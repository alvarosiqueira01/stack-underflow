export type AnswerSortBy = "votes" | "newest" | "oldest";

type Props = {
  answerCount: number;
  sortBy: AnswerSortBy;
  onSortChange: (value: AnswerSortBy) => void;
};

export function AnswersSectionHeader({ answerCount, sortBy, onSortChange }: Props) {
  return (
    <div className="flex items-center justify-between border-b pb-3">
      <h2 className="text-lg font-semibold text-zinc-900">{answerCount} Answers</h2>

      <select
        value={sortBy}
        onChange={(event) => onSortChange(event.target.value as AnswerSortBy)}
        className="rounded border border-zinc-200 px-2 py-1 text-sm"
      >
        <option value="votes">Highest score (default)</option>
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
    </div>
  );
}
