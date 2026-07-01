"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export function QuestionsPagination({ currentPage, totalPages, pageSize }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", e.target.value);
    params.set("page", "1"); // Reset à página 1 se mudar o tamanho
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-between p-4 border-t border-zinc-200">
      <div className="flex gap-1">
        {/* Lógica simplificada: Em produção, adicionaria reticências (...) para muitas páginas */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 2)
          .map((p) => (
            <Button
              key={p}
              variant={currentPage === p ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(p)}
            >
              {p}
            </Button>
          ))}
        {currentPage < totalPages && (
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-zinc-600">
        <span>Per page:</span>
        <select 
          value={pageSize} 
          onChange={handlePageSizeChange}
          className="border border-zinc-300 rounded p-1 text-sm bg-white"
        >
          <option value="15">15</option>
          <option value="30">30</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}