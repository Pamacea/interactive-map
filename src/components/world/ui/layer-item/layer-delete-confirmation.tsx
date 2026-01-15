"use client";

import { X } from "lucide-react";

interface LayerDeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LayerDeleteConfirmation({
  onConfirm,
  onCancel,
}: LayerDeleteConfirmationProps) {
  return (
    <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
      <button
        onClick={onConfirm}
        className="px-2 py-1 text-xs bg-rose-600 text-white rounded-sm hover:bg-rose-700 transition-colors font-medium"
      >
        Delete
      </button>
      <button
        onClick={onCancel}
        className="p-1 hover:bg-background-base rounded-sm transition-colors text-text-muted hover:text-text-secondary"
        title="Cancel"
        aria-label="Cancel delete"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
