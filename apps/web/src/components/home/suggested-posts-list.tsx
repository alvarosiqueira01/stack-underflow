import { useEffect, useState } from "react";
import { dashboardService } from "@/features/home/api/dashboard.service";
import { Badge } from "@/components/ui/badge";
import { useQuestions } from "@/features/questions/hooks/use-question";

export function SuggestedPostsList() {
  const [posts, setPosts] = useState<any[]>([]);

  const { data, isLoading } = useQuestions({
    page: 1,
    limit: 30,
  });
  
  return (
    <div className="border border-zinc-200 rounded-md divide-y divide-zinc-200">
      {data?.data?.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
}

// Subcomponente PostItem (Pode ser transferido para features/questions/components/post-item.tsx)
function PostItem({ post }: { post: any }) {
  const isAccepted = post.acceptedAnswerId !== null;
  const answersCount = post.answersCount || 0;

  return (
    <div className="p-4 flex gap-6 hover:bg-zinc-50 transition-colors">
      {/* Coluna da Esquerda (Status) */}
      <div className="flex flex-col items-end gap-1 w-24 flex-shrink-0 text-sm">
        <span className="text-zinc-800">{post.votes} votes</span>
        <span className={`px-1 py-0.5 rounded ${isAccepted ? 'bg-green-600 text-white' : answersCount > 0 ? 'border border-green-600 text-green-600' : 'text-zinc-500'}`}>
          {isAccepted && <span className="mr-1">✓</span>}
          {answersCount} answers
        </span>
        <span className="text-amber-700">{post.viewsCount} views</span>
      </div>

      {/* Coluna da Direita (Conteúdo) */}
      <div className="flex-1 flex flex-col gap-1">
        <a href={`/questions/${post.id}`} className="text-blue-600 text-lg hover:text-blue-500 font-medium">
          {post.title}
        </a>
        <p className="text-sm text-zinc-700 line-clamp-2">
          {post.body || "Preview text from the question body..."}
        </p>
        
        <div className="flex justify-between items-end mt-2">
          <div className="flex gap-1">
            {post.tags.map((tag: string) => (
              <Badge key={tag} label={tag}/>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {post.author?.avatarUrl && (
              <img src={post.author.avatarUrl} alt={post.author.name} className="w-4 h-4 rounded" />
            )}
            <span className="text-blue-500">{post.author?.name}</span>
            <span>asked {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}