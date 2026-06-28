import type { AuthorSummary } from "@/features/questions/types";
import { Avatar } from "../ui/avatar";

type Props = {
  author: AuthorSummary;
  label: string;
  timestamp: string;
};

export function AuthorCard({ author, label, timestamp }: Props) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-[#EFF3FB] p-3 text-sm">
      <Avatar src={author.avatarUrl} name={author.name} size={32} />
      <div>
        <div className="text-zinc-500">
          {label} {new Date(timestamp).toLocaleString()}
        </div>
        <a className="font-medium text-blue-600">{author.username}</a>{" "}
        <span className="text-zinc-500">{author.reputation}</span>
      </div>
    </div>
  );
}
