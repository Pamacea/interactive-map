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
    <div className="flex items-center gap-2 px-3 py-2 hover:bg-obsidian/30 transition-colors">
      {/* Expand/Collapse Button */}
      <button
        onClick={onToggleExpand}
        className="p-0.5 hover:bg-void rounded-sm transition-colors"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        <ChevronRight
          className={`w-3.5 h-3.5 text-bone-dark transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Layer Color Indicator */}
      <div className={`w-2 h-2 rounded-sm ${layerColor}`} />

      {/* Layer Name */}
      <span
        className={`flex-1 text-sm font-fell truncate ${
          layer.visible ? "text-bone-dark" : "text-bone-dark/50"
        }`}
      >
        {layer.name}
      </span>

      {/* Position Indicator */}
      {(layer.offsetX !== 0 || layer.offsetY !== 0) && (
        <span className="text-xs text-accent-gold font-medium font-display">
          ({layer.offsetX}, {layer.offsetY})
        </span>
      )}

      {/* Scale Indicator */}
      {layer.scale !== 1.0 && (
        <span className="text-xs text-accent-gold font-medium font-display">
          {Math.round(layer.scale * 100)}%
        </span>
      )}
    </div>
  );
}
