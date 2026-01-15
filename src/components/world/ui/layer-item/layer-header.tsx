"use client";

import { ChevronRight } from "lucide-react";
import { Layer } from "../../types/layer-types";

interface LayerHeaderProps {
  layer: Layer;
  layerColor: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function LayerHeader({
  layer,
  layerColor,
  isExpanded,
  onToggleExpand,
}: LayerHeaderProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 hover:bg-background-card-hover transition-colors">
      {/* Expand/Collapse Button */}
      <button
        onClick={onToggleExpand}
        className="p-0.5 hover:bg-background-base rounded-sm transition-colors"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        <ChevronRight
          className={`w-3.5 h-3.5 text-text-muted transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Layer Color Indicator */}
      <div className={`w-2 h-2 rounded-full ${layerColor}`} />

      {/* Layer Name */}
      <span
        className={`flex-1 text-sm truncate ${
          layer.visible ? "text-text-secondary" : "text-text-muted"
        }`}
      >
        {layer.name}
      </span>

      {/* Position Indicator */}
      {(layer.offsetX !== 0 || layer.offsetY !== 0) && (
        <span className="text-xs text-accent-gold font-medium">
          ({layer.offsetX}, {layer.offsetY})
        </span>
      )}

      {/* Scale Indicator */}
      {layer.scale !== 1.0 && (
        <span className="text-xs text-accent-gold font-medium">
          {Math.round(layer.scale * 100)}%
        </span>
      )}
    </div>
  );
}
