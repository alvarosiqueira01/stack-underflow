"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const FILTERS = [
  { label: "Newest", value: "newest" },
  { label: "Active", value: "active" },
  { label: "Bountied", value: "bountied" },
  { label: "Unanswered", value: "unanswered" },
];

export function QuestionsFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const currentSort = searchParams.get("sort") || "newest";

  const handleFilterChange = (filterValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", filterValue);
    params.set("page", "1"); // Ao mudar o filtro, regressa à página 1
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex border border-zinc-300 rounded overflow-hidden">
      {FILTERS.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors border-r last:border-r-0 border-zinc-300
            ${currentSort === filter.value 
              ? "bg-zinc-200 text-zinc-900" 
              : "bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}