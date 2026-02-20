"use client";

import { type AutosaveStatus } from "@/hooks/use-autosave";

interface AutosaveIndicatorProps {
  status: AutosaveStatus;
}

function getStatusText(status: AutosaveStatus): string {
  switch (status) {
    case "unsaved":
      return "Unsaved changes";
    case "saving":
      return "Saving...";
    case "saved":
      return "All changes saved";
    case "error":
      return "Save failed";
    default:
      return "";
  }
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  if (status === "idle") {
    return null;
  }

  const statusText = getStatusText(status);

  const getIcon = () => {
    switch (status) {
      case "unsaved":
        return (
          <div
            className="h-2 w-2 rounded-sm bg-status-warning-light"
            title={statusText}
          />
        );

      case "saving":
        return (
          <div
            className="h-3 w-3 animate-spin rounded-sm border-2 border-interactive-primary border-t-transparent"
            title={statusText}
          />
        );

      case "saved":
        return (
          <svg
            className="h-3 w-3 text-status-success-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );

      case "error":
        return (
          <svg
            className="h-3 w-3 text-status-error-dark"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return <div title={statusText}>{getIcon()}</div>;
}
