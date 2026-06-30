"use client";

import Link from "next/link";
import type { AuthUser } from "@/features/auth/api/auth.api";
import { usePendingReviewsCount } from "@/features/reviews/hooks/use-pending-reviews-count";
import { BellIcon, InboxIcon, ReviewIcon } from "../icons/nav-icons";

const REVIEWER_ROLES = ["established", "moderator", "admin"];

type Props = {
  user: AuthUser;
};

export function UserMenu({ user }: Props) {
  const { data: pendingReviews } = usePendingReviewsCount(user.role);
  const canReview = REVIEWER_ROLES.includes(user.role);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="hidden items-center gap-2 text-zinc-600 md:flex">
        <span className="font-medium text-zinc-900">{user.reputation.toLocaleString()}</span>
        <span className="flex items-center gap-1 text-amber-500" title="Gold badges">
          🥇 {user.badges.gold}
        </span>
        <span className="flex items-center gap-1 text-zinc-400" title="Silver badges">
          🥈 {user.badges.silver}
        </span>
        <span className="flex items-center gap-1 text-orange-700" title="Bronze badges">
          🥉 {user.badges.bronze}
        </span>
      </div>

      {canReview && (
        <Link
          href="/review"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50"
        >
          <ReviewIcon className="h-3.5 w-3.5 text-red-500" />
          Review
          {!!pendingReviews && (
            <span className="rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              {pendingReviews}
            </span>
          )}
        </Link>
      )}

      {/* Inbox e notificações ainda não têm dado real no backend — ícones de
          apoio visual, sem contagem nem destino funcional por enquanto. */}
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
        aria-label="Inbox"
      >
        <InboxIcon className="h-4.5 w-4.5" />
      </button>

      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100"
        aria-label="Notifications"
      >
        <BellIcon className="h-4.5 w-4.5" />
      </button>

      <Link
        href="/profile"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white"
      >
        {initials}
      </Link>
    </div>
  );
}
