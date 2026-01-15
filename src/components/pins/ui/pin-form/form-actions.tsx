import { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  mode: "create" | "edit";
  isSubmitting: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
}

export const FormActions: FC<FormActionsProps> = ({
  mode,
  isSubmitting,
  onCancel,
  onDelete,
}) => (
  <div className="flex items-center gap-3 pt-4">
    <Button
      type="submit"
      disabled={isSubmitting}
      className="flex-1"
    >
      {isSubmitting
        ? mode === "create"
          ? "Creating..."
          : "Updating..."
        : mode === "create"
          ? "Create Pin"
          : "Update Pin"
      }
    </Button>

    {onCancel && (
      <Button
        type="button"
        variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
    )}

    {mode === "edit" && onDelete && (
      <Button
        type="button"
        variant="secondary"
        onClick={onDelete}
        disabled={isSubmitting}
        className="ml-auto bg-red-600 hover:bg-red-700 text-white"
      >
        <X className="w-4 h-4 mr-2" />
        Delete
      </Button>
    )}
  </div>
);
