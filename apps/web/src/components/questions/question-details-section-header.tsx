import Link from "next/link";
import type { Breadcrumb } from "@/features/questions/types";
import { Button } from "../ui/button";

type Props = {
  breadcrumbs: Breadcrumb[];
  title: string;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  onAskQuestion: () => void;
};

export function QuestionDetailsSectionHeader({
  breadcrumbs,
  title,
  createdAt,
  updatedAt,
  viewsCount,
  onAskQuestion,
}: Props) {
  return (
    <div>
      <nav className="mb-2 text-sm text-zinc-500">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href}>
            {index > 0 && " > "}
            <Link href={crumb.href} className="hover:text-blue-600">
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
        <div className="w-40 shrink-0">
          <Button type="button" onClick={onAskQuestion}>
            Ask Question
          </Button>
        </div>
      </div>

      <div className="mt-2 flex gap-4 text-xs text-zinc-500">
        <span>Asked {new Date(createdAt).toLocaleDateString()}</span>
        <span>Modified {new Date(updatedAt).toLocaleString()}</span>
        <span>Viewed {viewsCount.toLocaleString()} times</span>
      </div>
    </div>
  );
}
