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
    <div className="flex justify-end gap-2 pt-2">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onCancel}
        disabled={isSubmitting}
        className="h-9 px-4"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        className="h-9 px-4 bg-accent-gold text-white hover:bg-accent-gold/90"
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        ) : (
          <>{isEditing ? "Update" : "Create"}</>
        )}
      </Button>
    </div>
  );
}
