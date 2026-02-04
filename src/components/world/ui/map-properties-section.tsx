import { Switch } from "@/components/ui/switch";
import { Globe } from "lucide-react";

interface MapPropertiesSectionProps {
  grid: boolean;
  snap: boolean;
  onGridChange: (checked: boolean) => void;
  onSnapChange: (checked: boolean) => void;
}

export function MapPropertiesSection({
  grid,
  snap,
  onGridChange,
  onSnapChange,
}: MapPropertiesSectionProps) {
  return (
    <section className="space-y-3">
      <div className="relative flex items-center gap-2 px-3 py-2.5 bg-stone/50  border-t border-accent-gold/50 border-b-iron/50">
        <Globe className="w-4 h-4 text-accent-gold" />
        <span className="text-xs font-display font-semibold text-accent-gold uppercase tracking-widest">
          Map Properties
        </span>
        <div className="ml-auto flex items-center gap-1">
          <span className="text-accent-gold/30 text-xs">ᛟ</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
      </div>

      <div className="space-y-0">
        <div
          className={`flex items-center justify-between px-3 py-2.5 bg-obsidian/60 border-x border-t border-iron/50 transition-colors ${
            grid ? "border-accent-gold/30" : ""
          }`}
        >
          <span className="text-sm text-bone-dark font-fell">Grid</span>
          <Switch checked={grid} onCheckedChange={onGridChange} />
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50 rounded-b-md transition-colors ${
            snap ? "border-accent-gold/30" : ""
          }`}
        >
          <span className="text-sm text-bone-dark font-fell">Snap</span>
          <Switch checked={snap} onCheckedChange={onSnapChange} />
        </div>
      </div>
    </section>
  );
}
