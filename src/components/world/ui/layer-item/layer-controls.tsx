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
            className="p-1 hover:bg-background-base rounded-sm transition-colors"
            title="Upload new map"
            aria-label="Upload new map"
          >
            <Upload className="w-3.5 h-3.5 text-accent-gold" />
          </button>
        ) : (
          !layer.isBaseMap && (
            <>
              <button
                onClick={() => onMoveUp(layer.id)}
                disabled={index === 0}
                className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
                aria-label="Move layer up"
              >
                <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
              </button>
              <button
                onClick={() => onMoveDown(layer.id)}
                disabled={index === totalLayers - 1}
                className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
                aria-label="Move layer down"
              >
                <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
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
        className="w-16 h-1 bg-background-base rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold"
        title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
        aria-label={`Layer opacity: ${Math.round(layer.opacity * 100)}%`}
      />

      {/* Visibility Toggle */}
      <button
        onClick={() => onToggleVisibility(layer.id)}
        className="p-1 hover:bg-background-base rounded-sm transition-colors"
        title={layer.visible ? "Hide layer" : "Show layer"}
        aria-label={layer.visible ? "Hide layer" : "Show layer"}
      >
        {layer.visible ? (
          <Eye className="w-3.5 h-3.5 text-text-muted" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-text-muted" />
        )}
      </button>

      {/* Lock Toggle */}
      <button
        onClick={() => onToggleLock(layer.id)}
        className="p-1 hover:bg-background-base rounded-sm transition-colors"
        title={layer.locked ? "Unlock layer" : "Lock layer"}
        aria-label={layer.locked ? "Unlock layer" : "Lock layer"}
      >
        {layer.locked ? (
          <Lock className="w-3 h-3 text-text-muted" />
        ) : (
          <Unlock className="w-3 h-3 text-text-muted" />
        )}
      </button>

      {/* Delete Button */}
      {!layer.isBaseMap && (
        <button
          onClick={() => onDeleteStart(layer.id)}
          className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100"
          title="Delete layer"
          aria-label="Delete layer"
        >
          <Trash2 className="w-3 h-3 text-text-muted hover:text-rose-500" />
        </button>
      )}
    </>
  );
}
