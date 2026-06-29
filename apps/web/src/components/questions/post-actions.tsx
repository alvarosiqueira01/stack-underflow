type Props = {
  onShare: () => void;
  onEdit: () => void;
  onFlag: () => void;
  onFollow?: () => void;
};

export function PostActions({ onShare, onEdit, onFlag, onFollow }: Props) {
  return (
    <div className="flex gap-4 text-sm text-zinc-500">
      <button type="button" onClick={onShare} className="hover:text-blue-600">
        Share
      </button>
      <button type="button" onClick={onEdit} className="hover:text-blue-600">
        Edit
      </button>
      {onFollow && (
        <button type="button" onClick={onFollow} className="hover:text-blue-600">
          Follow
        </button>
      )}
      <button type="button" onClick={onFlag} className="hover:text-blue-600">
        Flag
      </button>
    </div>
  );
}
