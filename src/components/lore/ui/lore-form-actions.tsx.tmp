import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoreFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export function LoreFormActions({
  isSubmitting,
  isEditing,
  onCancel,
  onSubmit,
}: LoreFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-2 border-t border-iron/50">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onCancel}
        disabled={isSubmitting}
        className="h-8 px-4 text-bone-dark hover:text-bone hover:bg-obsidian/50"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        className="h-8 px-4 bg-accent-gold text-void hover:bg-accent-gold/90"
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">Saving...</span>
          </div>
        ) : (
          <span className="text-xs font-display">{isEditing ? "Update" : "Create"}</span>
        )}
      </Button>
    </div>
  );
}
