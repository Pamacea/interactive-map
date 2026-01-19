/**
 * Popup header component
 * Displays pin icon, editable title, type, and action buttons (close and delete)
 */

import * as React from "react";
import { X, Trash2 } from "lucide-react";
import type { Pin } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { usePopupTitleEdit } from "../logic/use-popup-title-edit";
import { PopupTypeIcon, PopupTitleDisplay, PopupTitleEdit } from "./popup-header-parts";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

interface PopupHeaderProps {
  pin: Pin;
  onClose?: () => void;
  onDelete?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

export function PopupHeader({ pin, onClose, onDelete, onTitleChange }: PopupHeaderProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const titleEdit = usePopupTitleEdit({
    pinId: pin.id,
    initialTitle: pin.title,
    onTitleChange,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete pin:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-ornate)] bg-[rgb(212_175_55/0.05)] p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <PopupTypeIcon pinType={pin.pinType} />

        <div className="flex-1 min-w-0">
          {titleEdit.isEditing ? (
            <PopupTitleEdit
              editedTitle={titleEdit.editedTitle}
              inputRef={titleEdit.inputRef}
              onTitleChange={titleEdit.setEditedTitle}
              onSave={titleEdit.handleSaveEdit}
              onCancel={titleEdit.handleCancelEdit}
              onKeyDown={titleEdit.handleKeyDown}
            />
          ) : (
            <PopupTitleDisplay
              title={pin.title}
              pinType={pin.pinType}
              onEdit={titleEdit.handleStartEdit}
            />
          )}
        </div>
      </div>

      <PopupHeaderActions
        onClose={onClose}
        onDelete={() => setShowDeleteDialog(true)}
        showDelete={!!onDelete}
      />

      {onDelete && (
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}

interface PopupHeaderActionsProps {
  onClose?: () => void;
  onDelete: () => void;
  showDelete: boolean;
}

function PopupHeaderActions({ onClose, onDelete, showDelete }: PopupHeaderActionsProps) {
  return (
    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
      {showDelete && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          className="text-text-muted hover:text-red-600"
          aria-label="Delete pin"
          title="Delete pin"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}

      <Button
        size="icon"
        variant="ghost"
        onClick={onClose}
        className="text-text-muted hover:text-accent-gold"
        aria-label="Close popup"
        title="Close popup"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}
