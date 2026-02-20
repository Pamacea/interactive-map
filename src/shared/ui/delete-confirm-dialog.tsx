"use client";

import * as React from "react";
import { Button } from "./button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onOpenChange(false);
      }}
    >
      <div
        className="bg-obsidian border border-red-500/30 rounded-sm p-6 shadow-2xl max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-4">{description}</p>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="text-text-muted"
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className={isDestructive
              ? "bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/30"
              : undefined}
          >
            {isDeleting ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
