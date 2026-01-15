"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

interface DialogWrapperProps {
  title: string;
  onClose: () => void;
  disabled?: boolean;
  children: ReactNode;
}

export function DialogWrapper({
  title,
  onClose,
  disabled = false,
  children,
}: DialogWrapperProps) {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-background-elevated border border-border-base rounded-lg shadow-lg max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={handleContentClick}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-base">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            disabled={disabled}
            className="p-1 hover:bg-background-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        <div className="p-4 space-y-4">{children}</div>
      </div>
    </div>
  );
}
