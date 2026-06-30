"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { loginHref } from "@/features/auth/utils/login-href";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 gap-6">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-xl text-white text-sm font-semibold flex items-center justify-center">
            S
          </div>
          <span className="text-lg font-semibold text-zinc-900">
            stack<span className="text-blue-500">dev</span>
          </span>
        </Link>

        <nav className="flex gap-6 text-sm text-zinc-600">
          <Link href="/" className="hover:text-zinc-900">
            About
          </Link>
          <Link href="/questions" className="hover:text-zinc-900">
            Products
          </Link>
          <Link href="/users" className="hover:text-zinc-900">
            For Teams
          </Link>
        </nav>
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            placeholder="Search... try [tag] user:1234 score:5 answers:0"
            className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 outline-none focus:border-[#2F6BFF]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <UserMenu user={user} />
        ) : (
          <>
            <Link
              href={loginHref(pathname)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Log in
            </Link>
            <Link
              href={loginHref(pathname, "register")}
              className="rounded-lg bg-[#2F6BFF] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
