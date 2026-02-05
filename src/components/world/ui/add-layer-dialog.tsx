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
    <div className="px-3 py-2 rounded-sm bg-obsidian/70 border border-iron/50 space-y-2">
      <input
        id="new-layer-name"
        name="newLayerName"
        type="text"
        value={newLayerName}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Layer name..."
        className="w-full px-2 py-1.5 text-sm bg-void border border-iron rounded-sm focus:outline-none focus:border-accent-gold text-bone placeholder:text-bone-dark/50"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
          if (e.key === "Escape") onCancel();
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className="flex-1 px-2 py-1 text-xs bg-accent-gold text-void rounded-sm hover:bg-accent-gold/90 transition-colors font-display"
        >
          Create
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-2 py-1 text-xs bg-void border border-iron text-bone-dark rounded-sm hover:bg-obsidian transition-colors font-display"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
