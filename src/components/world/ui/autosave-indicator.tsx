"use client";

import { type AutosaveStatus } from "@/hooks/use-autosave";

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === "idle") {
    return null;
  }

  const getIndicator = () => {
    switch (status) {
      case "unsaved":
        return (
          <div className="flex items-center gap-2 text-sm text-amber-600">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Unsaved changes</span>
          </div>
        );

      case "saving":
        return (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="h-2 w-2 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            <span>Saving...</span>
          </div>
        );

      case "saved":
        return (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Saved</span>
          </div>
        );

      case "error":
        return (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span>Save failed</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-2 border-t bg-white">
      {getIndicator()}
    </div>
  );
}
