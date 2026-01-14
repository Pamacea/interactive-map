/**
 * Popup actions component
 * Displays edit and delete buttons for pin owners
 */

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PopupActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PopupActions({ onEdit, onDelete }: PopupActionsProps) {
  return (
    <div className="flex gap-2 border-t border-[var(--color-border-ornate)] bg-[rgb(0_0_0/0.2)] p-3">
      <Button variant="secondary" size="sm" onClick={onEdit} className="flex-1">
        <Pencil className="h-4 w-4" />
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-950/50"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
