import type { Pin } from "@prisma/client";

interface CoordinatesDisplayProps {
  pin: Pin;
}

export function CoordinatesDisplay({ pin }: CoordinatesDisplayProps) {
  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <label className="block text-xs text-text-muted mb-1.5">
        Coordinates
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-background-base rounded px-2 py-1.5">
          <span className="text-xs text-text-muted block">Lat</span>
          <span className="text-xs font-mono text-accent-gold">
            {pin.latitude.toFixed(4)}
          </span>
        </div>
        <div className="bg-background-base rounded px-2 py-1.5">
          <span className="text-xs text-text-muted block">Lng</span>
          <span className="text-xs font-mono text-accent-gold">
            {pin.longitude.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
