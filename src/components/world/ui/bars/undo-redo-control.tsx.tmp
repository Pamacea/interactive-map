/**
 * Undo/Redo Control - Buttons for undo and redo actions
 *
 * Features:
 * - Icons from lucide-react (Undo, Redo)
 * - Disabled state when no history available
 * - Tooltip with keyboard shortcut
 * - Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)
 */

import { Undo, Redo } from "lucide-react";
import { cn } from "@/lib/utils";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

export interface UndoRedoControlProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  className?: string;
}

export function UndoRedoControl({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  className,
}: UndoRedoControlProps) {
  // Register keyboard shortcuts
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: "z",
        ctrl: true,
        description: "Undo",
        handler: (e) => {
          if (canUndo) {
            e.preventDefault();
            onUndo();
            return true;
          }
          return false;
        },
      },
      {
        key: "z",
        ctrl: true,
        shift: true,
        description: "Redo",
        handler: (e) => {
          if (canRedo) {
            e.preventDefault();
            onRedo();
            return true;
          }
          return false;
        },
      },
    ],
    scope: "map-canvas",
    enabled: true,
  });

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Undo button */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="h-8 w-8 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:opacity-30 disabled:cursor-not-allowed bg-obsidian/90 backdrop-blur-md border border-iron"
        title={`Undo (Ctrl+Z)`}
        aria-label="Undo last action"
        type="button"
      >
        <Undo className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
      </button>

      {/* Redo button */}
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="h-8 w-8 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:opacity-30 disabled:cursor-not-allowed bg-obsidian/90 backdrop-blur-md border border-iron"
        title={`Redo (Ctrl+Shift+Z)`}
        aria-label="Redo last action"
        type="button"
      >
        <Redo className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
}
