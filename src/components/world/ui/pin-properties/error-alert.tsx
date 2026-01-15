import * as PinIcons from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-rose-950/30 border border-rose-700/50">
      <div className="flex items-start gap-2">
        <PinIcons.AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-rose-300">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs text-rose-300 hover:text-rose-200 underline flex-shrink-0"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
