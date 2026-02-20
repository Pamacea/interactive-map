/**
 * Shortcuts Dialog - Shows keyboard shortcuts for the map editor
 *
 * Displays all available keyboard shortcuts in an organized modal.
 */

import { X } from "lucide-react";
import { cn } from "@/shared/utils";

interface Shortcut {
  key: string;
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: Shortcut[];
}

const SHORTCUTS: ShortcutCategory[] = [
  {
    title: "Navigation",
    shortcuts: [
      { key: "Ctrl + Z", description: "Undo last action" },
      { key: "Ctrl + Shift + Z", description: "Redo action" },
      { key: "+ / -", description: "Zoom in/out" },
      { key: "Ctrl + Scroll", description: "Zoom in/out" },
      { key: "Space + Drag", description: "Pan map" },
    ],
  },
  {
    title: "Map Actions",
    shortcuts: [
      { key: "N", description: "Create new pin" },
      { key: "Delete", description: "Delete selected pin" },
      { key: "Escape", description: "Cancel action / Close modal" },
      { key: "F", description: "Toggle search" },
    ],
  },
  {
    title: "Layers",
    shortcuts: [
      { key: "L", description: "Toggle layers panel" },
      { key: "[", description: "Select layer above" },
      { key: "]", description: "Select layer below" },
      { key: "H", description: "Toggle selected layer visibility" },
    ],
  },
  {
    title: "View",
    shortcuts: [
      { key: "G", description: "Toggle grid" },
      { key: "S", description: "Toggle snap to grid" },
      { key: "0", description: "Reset view to 100%" },
    ],
  },
];

export interface ShortcutsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-void/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div
        className="bg-obsidian border border-iron rounded-sm shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-iron">
          <h2 id="shortcuts-title" className="font-display font-semibold text-accent-gold">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="h-7 w-7 flex items-center justify-center text-bone-dark hover:text-accent-gold hover:bg-accent-gold/10 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
            aria-label="Close dialog"
            type="button"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {SHORTCUTS.map((category) => (
            <div key={category.title} className="mb-6 last:mb-0">
              <h3 className="font-display font-medium text-bone mb-2 text-sm">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.key}
                    className="flex items-center justify-between py-1.5 px-2 rounded-sm hover:bg-iron/30 transition-colors"
                  >
                    <span className="text-sm text-text-secondary">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-0.5 text-xs font-mono bg-stone border border-iron rounded text-bone-dark">
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-iron text-center">
          <p className="text-xs text-text-muted">
            Press <kbd className="px-1.5 py-0.5 font-mono bg-stone border border-iron rounded text-bone-dark mx-1">?</kbd> to open this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
