import type { Comment } from "@/features/questions/types";
import { Avatar } from "../ui/avatar";

type Props = {
  comments: Comment[];
  isFormOpen: boolean;
  onToggleForm: () => void;
  onSubmit: (text: string) => void;
};

export function CommentList({ comments, isFormOpen, onToggleForm, onSubmit }: Props) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const text = new FormData(form).get("comment");
    if (typeof text === "string" && text.trim().length > 0) {
      onSubmit(text.trim());
      form.reset();
    }
  }

  return (
    <div className="mt-3 space-y-2 border-t pt-3 text-sm">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <span>{comment.body}</span>
          <span className="text-zinc-400">–</span>
          <Avatar src={comment.author.avatarUrl} name={comment.author.name} size={18} />
          <a className="text-blue-600">{comment.author.username}</a>
          <span className="text-zinc-400">{comment.author.reputation}</span>
        </div>
      ))}

      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="flex gap-2 pt-1">
          <input
            name="comment"
            placeholder="Add a comment"
            className="flex-1 rounded border border-zinc-200 px-3 py-1.5 text-sm outline-none focus:border-[#2F6BFF]"
          />
          <button type="submit" className="text-sm text-blue-600">
            Add
          </button>
        </form>
      ) : (
        <button type="button" onClick={onToggleForm} className="text-zinc-500 hover:text-blue-600">
          Add a comment
        </button>
      )}
    </div>
  );
}
