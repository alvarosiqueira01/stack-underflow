"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";
import { Button } from "@/components/ui/button";

import { useQuestions } from "@/features/questions/hooks/use-question";
import { PostItem } from "@/components/questions/post-item";
import { QuestionsFilterBar } from "@/components/questions/questions-filter-bar";
import { QuestionsPagination } from "@/components/questions/questions-pagination";

export default function QuestionsPage() {
  const searchParams = useSearchParams();
  
  // Lê os parâmetros da URL ou usa valores por defeito
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 15;
  const sort = searchParams.get("sort") || "newest";

  const { data: response, isLoading, isError } = useQuestions({ page, limit, sort });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        
        <main className="flex-1 px-6 py-6 border-l border-zinc-200">
          
          {/* Cabeçalho do Feed */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-normal mb-4">All Questions</h1>
              {!isLoading && response?.meta && (
                <span className="text-lg text-zinc-800">
                  {response.meta.totalItems.toLocaleString()} questions
                </span>
              )}
            </div>
            <Link href="/ask">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Ask Question
              </Button>
            </Link>
          </div>

          {/* Barra de Filtros */}
          <div className="flex justify-end mb-4">
            <QuestionsFilterBar />
          </div>

          {/* Lista de Questões */}
          <div className="border border-zinc-200 rounded-t-md border-b-0">
            {isLoading ? (
              // Skeleton simples para indicar carregamento
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-32 border-b border-zinc-200 animate-pulse bg-zinc-50" />
              ))
            ) : isError ? (
              <div className="p-8 text-center text-red-500">
                Failed to load questions. Please try again later.
              </div>
            ) : response?.data?.length === 0 ? (
              <div className="p-8 text-center text-zinc-500">
                No questions found matching your criteria.
              </div>
            ) : (
              response?.data?.map((question: any) => (
                <PostItem key={question.id} question={question} />
              ))
            )}
          </div>

          {/* Paginação */}
          {!isLoading && response?.meta && (
            <div className="border border-zinc-200 rounded-b-md border-t-0 bg-white">
              <QuestionsPagination 
                currentPage={response.meta.page}
                totalPages={response.meta.totalPages}
                pageSize={response.meta.limit}
              />
            </div>
          )}

        </main>

        <RightPanel />
      </div>
    </div>
  );
}