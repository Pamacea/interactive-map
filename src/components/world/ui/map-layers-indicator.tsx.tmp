import { FC } from "react";

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
}

export interface MapLayersIndicatorProps {
  layers: Layer[];
}

export const MapLayersIndicator: FC<MapLayersIndicatorProps> = ({ layers }) => {
  if (layers.length === 0) return null;

  return (
    <div
      className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-none"
      style={{ opacity: 0.8 }}
    >
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="px-3 py-1.5 rounded-sm bg-background-elevated/90 border border-border-subtle text-xs text-text-secondary backdrop-blur-sm"
          style={{
            opacity: layer.opacity,
            zIndex: layer.zIndex,
          }}
        >
          {layer.name}
          {layer.locked && (
            <span className="ml-2 text-accent-gold">🔒</span>
          )}
        </div>
      ))}
    </div>
  );
};
