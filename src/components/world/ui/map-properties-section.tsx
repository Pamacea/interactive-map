import { Switch } from "@/components/ui/switch";

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
      <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
        <svg
          className="w-4 h-4 text-text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs font-display font-medium text-text-secondary uppercase tracking-wider">
          Map Properties
        </span>
      </div>

      <div className="space-y-3">
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${
            grid ? "border border-accent-gold/30" : "border border-border-subtle"
          }`}
        >
          <span className="text-sm text-text-secondary">Grid</span>
          <Switch checked={grid} onCheckedChange={onGridChange} />
        </div>

        <div
          className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${
            snap ? "border border-accent-gold/30" : "border border-border-subtle"
          }`}
        >
          <span className="text-sm text-text-secondary">Snap</span>
          <Switch checked={snap} onCheckedChange={onSnapChange} />
        </div>
      </div>
    </section>
  );
}
