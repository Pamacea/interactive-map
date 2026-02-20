import type { Pin } from "@prisma/client";

interface CoordinatesDisplayProps {
  pin: Pin;
}

export function CoordinatesDisplay({ pin }: CoordinatesDisplayProps) {
  return (
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <label className="block text-xs font-display text-bone-dark mb-2 uppercase tracking-wide">
        Coordinates
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-void/50 rounded px-2.5 py-2 border border-iron/30">
          <span className="text-xs text-bone-dark/70 block mb-0.5">Lat</span>
          <span className="text-xs font-mono text-accent-gold font-semibold">
            {pin.latitude.toFixed(4)}
          </span>
        </div>
        <div className="bg-void/50 rounded px-2.5 py-2 border border-iron/30">
          <span className="text-xs text-bone-dark/70 block mb-0.5">Lng</span>
          <span className="text-xs font-mono text-accent-gold font-semibold">
            {pin.longitude.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
