import { Eye, EyeOff, X } from "lucide-react";

interface AddLayerDialogProps {
  newLayerName: string;
  onNameChange: (name: string) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function AddLayerDialog({
  newLayerName,
  onNameChange,
  onAdd,
  onCancel,
}: AddLayerDialogProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle space-y-2">
      <input
        type="text"
        value={newLayerName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Layer name..."
        className="w-full px-2 py-1.5 text-sm bg-background-base border border-border-subtle rounded-sm focus:outline-none focus:border-accent-gold text-text-primary placeholder:text-text-muted"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
          if (e.key === "Escape") onCancel();
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className="flex-1 px-2 py-1 text-xs bg-accent-gold text-background-base rounded-sm hover:bg-accent-gold/90 transition-colors"
        >
          Create
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-2 py-1 text-xs bg-background-base border border-border-subtle text-text-secondary rounded-sm hover:bg-background-elevated transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
