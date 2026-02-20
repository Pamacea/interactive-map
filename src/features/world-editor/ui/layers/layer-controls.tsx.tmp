/**
 * Layer Controls - Unified control buttons for layers
 * @module layers/controls
 *
 * UX Improvements:
 * - Larger touch targets (32px minimum)
 * - Better visual separation between controls
 * - Clearer active states
 * - Subtle animations on hover
 */

"use client";

import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Upload,
  ChevronUp,
  ChevronDown,
  GripVertical,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/shared/utils";
import type { Layer, LayerActions, LayerDisplayMode } from "./layer-types";

interface LayerControlsProps {
  layer: Layer;
  index: number;
  totalLayers: number;
  displayMode: LayerDisplayMode;
  actions: LayerActions;
  showDelete?: boolean;
  showMove?: boolean;
  showDragHandle?: boolean;
  isConfirmingDelete?: boolean;
  onDeleteCancel?: () => void;
  onDeleteConfirm?: () => void;
}

export function LayerControls({
  layer,
  index,
  totalLayers,
  displayMode,
  actions,
  showDelete = true,
  showMove = true,
  showDragHandle = false,
  isConfirmingDelete = false,
  onDeleteCancel,
  onDeleteConfirm,
}: LayerControlsProps) {
  const canMoveUp = showMove && index > 0 && !layer.isBaseMap;
  const canMoveDown = showMove && index < totalLayers - 1 && !layer.isBaseMap;

  const { showLabels } = displayMode;

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        showLabels ? "flex-shrink-0" : ""
      )}
    >
      {/* Delete confirmation state */}
      {isConfirmingDelete ? (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
          <button
            onClick={onDeleteConfirm}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
              "bg-blood text-bone hover:bg-blood/90 hover:shadow-lg",
              "border border-blood/70"
            )}
            type="button"
          >
            Delete
          </button>
          <button
            onClick={onDeleteCancel}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-sm transition-all",
              "text-bone-dark/60 hover:text-bone-dark hover:bg-iron/50"
            )}
            title="Cancel"
            type="button"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        </div>
      ) : (
        <>
          {/* Visibility Toggle - Always visible, larger touch target */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.onToggleVisibility(layer.id);
            }}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-150",
              "text-bone-dark/60 hover:text-accent-gold hover:bg-iron/60 active:scale-95",
              !layer.visible && "text-bone-dark/30"
            )}
            title={layer.visible ? "Hide layer" : "Show layer"}
            aria-label={`${layer.visible ? "Hide" : "Show"} ${layer.name}`}
            aria-pressed={layer.visible}
            type="button"
          >
            {layer.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Lock Toggle - Always visible, larger touch target */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              actions.onToggleLock(layer.id);
            }}
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-150",
              "text-bone-dark/60 hover:text-accent-gold hover:bg-iron/60 active:scale-95",
              layer.locked && "text-accent-gold"
            )}
            title={layer.locked ? "Unlock layer" : "Lock layer"}
            aria-label={`${layer.locked ? "Unlock" : "Lock"} ${layer.name}`}
            aria-pressed={layer.locked}
            type="button"
          >
            {layer.locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </button>

          {/* Advanced controls - Only visible on hover or when always shown */}
          {showLabels && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
              {/* Drag handle - shown when labels visible */}
              {showDragHandle && !layer.isBaseMap && (
                <div className="cursor-grab active:cursor-grabbing p-1.5 text-bone-dark/30 hover:text-bone-dark/60 transition-colors">
                  <GripVertical className="w-4 h-4" />
                </div>
              )}

              {/* Move up/down buttons - when expanded and not base map */}
              {showMove && !layer.isBaseMap && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onMoveUp?.(layer.id);
                    }}
                    disabled={!canMoveUp}
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-sm transition-all duration-150",
                      "text-bone-dark/60 hover:text-accent-gold hover:bg-iron/50 active:scale-95",
                      "disabled:opacity-20 disabled:cursor-not-allowed"
                    )}
                    title="Move up"
                    aria-label={`Move ${layer.name} up`}
                    type="button"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onMoveDown?.(layer.id);
                    }}
                    disabled={!canMoveDown}
                    className={cn(
                      "w-7 h-7 flex items-center justify-center rounded-sm transition-all duration-150",
                      "text-bone-dark/60 hover:text-accent-gold hover:bg-iron/50 active:scale-95",
                      "disabled:opacity-20 disabled:cursor-not-allowed"
                    )}
                    title="Move down"
                    aria-label={`Move ${layer.name} down`}
                    type="button"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Delete Button - not for base map */}
              {showDelete && !layer.isBaseMap && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onDelete?.(layer.id);
                  }}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-150",
                    "text-bone-dark/40 hover:text-rose-500 hover:bg-rose-500/10 active:scale-95"
                  )}
                  title="Delete layer"
                  aria-label={`Delete ${layer.name}`}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Opacity slider component for layers
 */
interface OpacitySliderProps {
  layer: Layer;
  onChange: (layerId: string, opacity: number) => void;
  className?: string;
}

export function OpacitySlider({
  layer,
  onChange,
  className,
}: OpacitySliderProps) {
  return (
    <div className={cn("px-3 pb-2.5", className)}>
      <div className="flex items-center justify-between text-xs text-bone-dark/60 mb-2">
        <span className="font-medium">Opacity</span>
        <span className="font-display text-accent-gold">{Math.round(layer.opacity * 100)}%</span>
      </div>
      <input
        id={`layer-opacity-${layer.id}`}
        name={`layerOpacity-${layer.id}`}
        type="range"
        min="0"
        max="100"
        value={layer.opacity * 100}
        onChange={(e) =>
          onChange(layer.id, parseInt(e.target.value) / 100)
        }
        className="w-full h-2 bg-void/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(250,204,21,0.5)]"
        title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
        aria-label={`Layer ${layer.name} opacity: ${Math.round(layer.opacity * 100)}%`}
        data-no-shortcut="true"
      />
    </div>
  );
}
