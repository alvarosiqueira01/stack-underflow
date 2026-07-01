import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface PostItemProps {
  question: any; // Idealmente tipado com a interface Question do seu OpenAPI
}

export function PostItem({ question }: PostItemProps) {
  const isAccepted = !!question.acceptedAnswerId;
  const hasAnswers = question.answersCount > 0;

  // Lógica para aplicar classes consoante o estado das respostas
  let answersStyle = "text-zinc-500";
  if (isAccepted) {
    answersStyle = "bg-green-600 text-white border-green-600";
  } else if (hasAnswers) {
    answersStyle = "border border-green-600 text-green-600";
  }

  return (
    <div className="flex gap-4 p-4 border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
      {/* Coluna da Esquerda (Estatísticas) */}
      <div className="flex flex-col items-end gap-1.5 w-24 flex-shrink-0 text-sm mt-1">
        <span className="text-zinc-800">{question.votes} votes</span>
        <span className={`px-1.5 py-0.5 rounded text-center ${answersStyle}`}>
          {isAccepted && <span className="mr-1">✓</span>}
          {question.answersCount} answers
        </span>
        <span className="text-amber-700">{question.viewsCount} views</span>
      </div>

      {/* Coluna da Direita (Resumo da Pergunta) */}
      <div className="flex-1 flex flex-col gap-1.5">
        <Link 
          href={`/questions/${question.id}`} 
          className="text-lg text-blue-600 hover:text-blue-500 font-medium"
        >
          {question.title}
        </Link>
        
        {/* Preview do corpo (removendo markdown e limitando o tamanho) */}
        <p className="text-sm text-zinc-600 line-clamp-2">
          {question.body?.substring(0, 200)}...
        </p>
        
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1.5 flex-wrap">
            {question.tags.map((tag: string) => (
              <Link key={tag} href={`/tags/${tag}`}>
                <Badge label={tag}/>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            {question.author?.avatarUrl && (
              <img 
                src={question.author.avatarUrl} 
                alt={question.author.name} 
                className="w-4 h-4 rounded" 
              />
            )}
            <Link href={`/users/${question.author?.username}`} className="text-blue-500 hover:underline">
              {question.author?.name}
            </Link>
            <span>asked {new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}