import * as PinIcons from "lucide-react";

export function UpdatingIndicator() {
  return (
    <div className="px-3 py-2.5 rounded-sm bg-obsidian/60 border border-accent-gold/50 flex items-center gap-2">
      <PinIcons.Loader2 className="w-4 h-4 text-accent-gold animate-spin" />
      <p className="text-xs text-bone-dark font-fell">Updating pin...</p>
      <span className="ml-auto text-accent-gold/40 text-xs">ᛟ</span>
    </div>
  );
}
