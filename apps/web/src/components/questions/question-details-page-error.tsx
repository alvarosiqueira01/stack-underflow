type Props = {
  message: string;
  onRetry: () => void;
};

export function QuestionDetailsPageError({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 p-10 text-center">
      <p className="text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-xl bg-[#2F6BFF] px-5 py-2 font-medium text-white hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
