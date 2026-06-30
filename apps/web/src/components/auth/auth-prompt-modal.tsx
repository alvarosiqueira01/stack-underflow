"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthPromptStore } from "@/features/auth/stores/auth-prompt.store";
import { loginHref } from "@/features/auth/utils/login-href";

export function AuthPromptModal() {
  const isOpen = useAuthPromptStore((state) => state.isOpen);
  const close = useAuthPromptStore((state) => state.close);
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={close}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-900">Log in to continue</h2>
        <p className="mt-2 text-sm text-zinc-500">
          You need an account to vote, comment, or answer questions.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={loginHref(pathname)}
            onClick={close}
            className="flex-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Log in
          </Link>
          <Link
            href={loginHref(pathname, "register")}
            onClick={close}
            className="flex-1 rounded-xl bg-[#2F6BFF] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-4 text-sm text-zinc-400 hover:text-zinc-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
