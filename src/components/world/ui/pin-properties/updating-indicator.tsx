import * as PinIcons from "lucide-react";

export function UpdatingIndicator() {
  return (
    <div className="px-3 py-2 rounded-sm bg-blue-950/30 border border-blue-700/50">
      <div className="flex items-center gap-2">
        <PinIcons.Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
        <p className="text-xs text-blue-300">Updating pin...</p>
      </div>
    </div>
  );
}
