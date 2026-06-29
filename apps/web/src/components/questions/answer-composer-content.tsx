import Link from "next/link";

type Props = {
  isAuthenticated: boolean;
  draftBody: string;
  loginHref: string;
  registerHref: string;
  onBodyChange: (text: string) => void;
};

export function AnswerComposerContent({
  isAuthenticated,
  draftBody,
  loginHref,
  registerHref,
  onBodyChange,
}: Props) {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-zinc-200 py-8">
        <p className="text-sm text-zinc-700">You must be signed in to post an answer.</p>

        <div className="flex gap-3">
          <Link
            href={loginHref}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Log in
          </Link>
          <Link
            href={registerHref}
            className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <textarea
      value={draftBody}
      onChange={(event) => onBodyChange(event.target.value)}
      placeholder="Write your answer here..."
      rows={8}
      className="w-full rounded-xl border border-zinc-200 bg-white p-4 text-zinc-700 outline-none focus:border-[#2F6BFF]"
    />
  );
}
