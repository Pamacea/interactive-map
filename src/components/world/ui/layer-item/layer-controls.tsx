"use client";

import { Eye, EyeOff, Lock, Unlock, Trash2, Upload, ChevronUp, ChevronDown } from "lucide-react";
import { Layer } from "../../types/layer-types";

interface LayerControlsProps {
  layer: Layer;
  index: number;
  totalLayers: number;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onMoveUp: (layerId: string) => void;
  onMoveDown: (layerId: string) => void;
  onDeleteStart: (layerId: string) => void;
  onUploadMap?: () => void;
}

export function LayerControls({
  layer,
  index,
  totalLayers,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onMoveUp,
  onMoveDown,
  onDeleteStart,
  onUploadMap,
}: LayerControlsProps) {
  return (
    <>
      {/* Action Buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {layer.isBaseMap && onUploadMap ? (
          <button
            onClick={onUploadMap}
            className="p-1 hover:bg-background-base rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
            title="Upload new map"
            aria-label={`Upload new map for ${layer.name}`}
            type="button"
          >
            <Upload className="w-3.5 h-3.5 text-accent-gold" aria-hidden="true" />
          </button>
        ) : (
          !layer.isBaseMap && (
            <>
              <button
                onClick={() => onMoveUp(layer.id)}
                disabled={index === 0}
                className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:focus:ring-0"
                title="Move up"
                aria-label={`Move layer ${layer.name} up`}
                type="button"
              >
                <ChevronUp className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
              </button>
              <button
                onClick={() => onMoveDown(layer.id)}
                disabled={index === totalLayers - 1}
                className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:focus:ring-0"
                title="Move down"
                aria-label={`Move layer ${layer.name} down`}
                type="button"
              >
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
              </button>
            </>
          )
        )}
      </div>

      {/* Opacity Slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={layer.opacity * 100}
        onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value) / 100)}
        className="w-16 h-1 bg-background-base rounded-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent-gold/50 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold"
        title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
        aria-label={`Layer ${layer.name} opacity: ${Math.round(layer.opacity * 100)}%`}
      />

      {/* Visibility Toggle */}
      <button
        onClick={() => onToggleVisibility(layer.id)}
        className="p-1 hover:bg-background-base rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        title={layer.visible ? "Hide layer" : "Show layer"}
        aria-label={`${layer.visible ? "Hide" : "Show"} layer ${layer.name}`}
        aria-pressed={layer.visible}
        type="button"
      >
        {layer.visible ? (
          <Eye className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />
        )}
      </button>

      {/* Lock Toggle */}
      <button
        onClick={() => onToggleLock(layer.id)}
        className="p-1 hover:bg-background-base rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
        title={layer.locked ? "Unlock layer" : "Lock layer"}
        aria-label={`${layer.locked ? "Unlock" : "Lock"} layer ${layer.name}`}
        aria-pressed={layer.locked}
        type="button"
      >
        {layer.locked ? (
          <Lock className="w-3 h-3 text-text-muted" aria-hidden="true" />
        ) : (
          <Unlock className="w-3 h-3 text-text-muted" aria-hidden="true" />
        )}
      </button>

      {/* Delete Button */}
      {!layer.isBaseMap && (
        <button
          onClick={() => onDeleteStart(layer.id)}
          className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          title="Delete layer"
          aria-label={`Delete layer ${layer.name}`}
          type="button"
        >
          <Trash2 className="w-3 h-3 text-text-muted hover:text-rose-500" aria-hidden="true" />
        </button>
      )}
    </>
  );
}
