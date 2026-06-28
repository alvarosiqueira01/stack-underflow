type Props = {
  votes: number;
  userVote: 1 | 0 | -1 | null;
  isAccepted?: boolean;
  onVote: (value: 1 | -1) => void;
};

export function VoteControl({ votes, userVote, isAccepted, onVote }: Props) {
  return (
    <div className="flex flex-col items-center gap-1 pt-1">
      <button
        type="button"
        aria-label="Upvote"
        onClick={() => onVote(1)}
        className={`text-xl ${userVote === 1 ? "text-blue-600" : "text-zinc-400 hover:text-zinc-600"}`}
      >
        ▲
      </button>

      <span className="text-lg font-semibold text-zinc-800">{votes}</span>

      <button
        type="button"
        aria-label="Downvote"
        onClick={() => onVote(-1)}
        className={`text-xl ${userVote === -1 ? "text-blue-600" : "text-zinc-400 hover:text-zinc-600"}`}
      >
        ▼
      </button>

      {isAccepted && (
        <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
          ✓
        </span>
      )}
    </div>
  );
}
