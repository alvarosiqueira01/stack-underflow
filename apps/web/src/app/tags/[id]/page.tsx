// src/app/tags/[id]/page.tsx
"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { RightPanel } from "@/components/layout/right-panel";
import { Button } from "@/components/ui/button";

import { useTagDetails } from "@/features/tags/hooks/use-tag";
import { useQuestions } from "@/features/questions/hooks/use-question";
import { PostItem } from "@/components/questions/post-item";
import { QuestionsFilterBar } from "@/components/questions/questions-filter-bar";
import { QuestionsPagination } from "@/components/questions/questions-pagination";
import { WatchDropdown } from "@/components/tags/watch-dropdown";
import { QuickTagManager } from "@/components/layout/quick-tag-manager";

export default function TagDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const tagId = String(params.id);

  // Estados de Paginação e Ordenação controlados pela URL
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 15;
  const sort = searchParams.get("sort") || "newest";

  // Consome a API do backend
  const { data: tag, isLoading: tagLoading } = useTagDetails(tagId);
  const { data: response, isLoading: questionsLoading } = useQuestions({ 
    page, 
    limit, 
    sort, 
    tag: tagId // Passa o filtro da tag para o motor de busca de perguntas
  } as any);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex max-w-7xl mx-auto">
        <Sidebar />
        
        <main className="flex-1 px-6 py-6 border-l border-zinc-200">
          
          {/* Cabeçalho da Tag */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-normal mb-2">
                Questions tagged <span className="font-semibold text-zinc-900">[{tagId}]</span>
              </h1>
              
              {tagLoading ? (
                <div className="h-4 w-48 bg-zinc-200 animate-pulse rounded my-2" />
              ) : (
                <p className="text-zinc-600 text-sm max-w-2xl mb-4 leading-relaxed">
                  {tag?.description || "This tag does not have a wiki description created yet. Contribute to community adding a description."}
                </p>
              )}

              <div className="mt-2">
                <WatchDropdown tagId={tagId} />
              </div>
            </div>

            <Link href="/ask">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Ask Question
              </Button>
            </Link>
          </div>

          {/* Sub-header com o número total de itens e os filtros */}
          <div className="flex justify-between items-center my-6 pb-2 border-b border-zinc-100">
            <span className="text-zinc-700 text-sm font-medium">
              {questionsLoading ? "Loading..." : `${response?.meta?.totalItems?.toLocaleString() || 0} questions`}
            </span>
            <QuestionsFilterBar />
          </div>

          {/* Listagem de Posts Filtrados */}
          <div className="border border-zinc-200 rounded-t-md border-b-0">
            {questionsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-32 border-b border-zinc-200 animate-pulse bg-zinc-50" />
              ))
            ) : response?.data?.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                Não existem perguntas associadas à tag <span className="font-semibold">[{tagId}]</span> com este filtro.
              </div>
            ) : (
              response?.data?.map((question: any) => (
                <PostItem key={question.id} question={question} />
              ))
            )}
          </div>

          {/* Paginação */}
          {!questionsLoading && response?.meta && (
            <div className="border border-zinc-200 rounded-b-md border-t-0 bg-white">
              <QuestionsPagination 
                currentPage={response.meta.page}
                totalPages={response.meta.totalPages}
                pageSize={response.meta.limit}
              />
            </div>
          )}

        </main>

        {/* Coluna Direita Contextualizada com o Painel de Tags Customizado */}
        <div className="w-72 px-4 py-6 hidden lg:block flex-shrink-0">
          <QuickTagManager />
          <RightPanel
        //    hideStandardLayout
            /> 
          {/* Nota: Adiciona uma flag 'hideStandardLayout' ao teu RightPanel para que possas reusar os componentes internos (Blog e Hot Questions) sem duplicar estruturas */}
        </div>
      </div>
    </div>
  );
}