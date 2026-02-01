import * as PinIcons from "lucide-react";

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorAlert({ error, onRetry }: ErrorAlertProps) {
  return (
    <div className="px-3 py-2.5 rounded-sm bg-blood/20 border border-blood/50">
      <div className="flex items-start gap-2">
        <PinIcons.AlertCircle className="w-4 h-4 text-blood-bright mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-bone font-fell">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-xs font-display text-accent-gold hover:text-accent-gold-light underline flex-shrink-0 uppercase tracking-wide"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
