/**
 * Layer Properties - Unified properties panel for layers
 * @module layers/properties
 */

"use client";

import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Layer, LayerActions } from "./layer-types";

interface LayerPropertiesProps {
  layer: Layer;
  actions: LayerActions;
  showZoomControls?: boolean;
  showPositionControls?: boolean;
  showScaleControl?: boolean;
  className?: string;
}

export function LayerProperties({
  layer,
  actions,
  showZoomControls = true,
  showPositionControls = !layer.isBaseMap,
  showScaleControl = !layer.isBaseMap,
  className,
}: LayerPropertiesProps) {
  return (
    <div
      className={cn(
        "px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200",
        className
      )}
    >
      {/* Position Controls */}
      {showPositionControls && actions.onOpacityChange && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Position (X, Y)</span>
            <span className="text-bone font-medium font-display">
              {layer.offsetX}px, {layer.offsetY}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label
                htmlFor={`x-offset-${layer.id}`}
                className="text-xs text-bone-dark/70 block mb-1"
              >
                X
              </label>
              <input
                id={`x-offset-${layer.id}`}
                type="number"
                value={layer.offsetX}
                onChange={(e) => {
                  const _val = parseInt(e.target.value) || 0;
                  // Would need position change action
                  console.log("X offset:", val);
                }}
                className="w-full h-8 px-2 text-sm bg-void border border-iron rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-bone"
                min="-5000"
                max="5000"
                aria-label="X offset"
                data-no-shortcut="true"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor={`y-offset-${layer.id}`}
                className="text-xs text-bone-dark/70 block mb-1"
              >
                Y
              </label>
              <input
                id={`y-offset-${layer.id}`}
                type="number"
                value={layer.offsetY}
                onChange={(e) => {
                  const _val = parseInt(e.target.value) || 0;
                  console.log("Y offset:", val);
                }}
                className="w-full h-8 px-2 text-sm bg-void border border-iron rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-bone"
                min="-5000"
                max="5000"
                aria-label="Y offset"
                data-no-shortcut="true"
              />
            </div>
          </div>
        </div>
      )}

      {/* Opacity Control */}
      {actions.onOpacityChange && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Opacity</span>
            <span className="text-bone font-medium font-display">
              {Math.round(layer.opacity * 100)}%
            </span>
          </div>
          <input
            id={`layer-opacity-${layer.id}`}
            name={`layerOpacity-${layer.id}`}
            type="range"
            min="0"
            max="100"
            value={layer.opacity * 100}
            onChange={(e) =>
              actions.onOpacityChange?.(
                layer.id,
                parseInt(e.target.value) / 100
              )
            }
            className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            aria-label={`Layer opacity: ${Math.round(layer.opacity * 100)}%`}
            data-no-shortcut="true"
          />
        </div>
      )}

      {/* Scale Control */}
      {showScaleControl && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Scale</span>
            <span className="text-bone font-medium font-display">
              {Math.round(layer.scale * 100)}%
            </span>
          </div>
          <input
            id={`layer-scale-${layer.id}`}
            name={`layerScale-${layer.id}`}
            type="range"
            min="50"
            max="200"
            value={layer.scale * 100}
            onChange={(e) => {
              console.log("Scale:", parseInt(e.target.value) / 100);
            }}
            className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            aria-label={`Layer scale: ${Math.round(layer.scale * 100)}%`}
            data-no-shortcut="true"
          />
        </div>
      )}

      {/* Zoom Visibility Control */}
      {showZoomControls && !layer.isBaseMap && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Zoom Visibility</span>
            {actions.onResetZoom && (
              <button
                type="button"
                onClick={() => actions.onResetZoom?.(layer.id)}
                className="text-xs text-accent-gold/70 hover:text-accent-gold transition-colors"
              >
                Reset
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-bone-dark/70">Min Zoom</span>
              <span className="text-xs font-display font-semibold text-accent-gold">
                {layer.minZoom}%
              </span>
            </div>
            <input
              id={`layer-min-zoom-${layer.id}`}
              name={`layerMinZoom-${layer.id}`}
              type="range"
              min="0"
              max="200"
              value={layer.minZoom}
              onChange={(e) => {
                const zoom = parseInt(e.target.value);
                if (zoom <= layer.maxZoom) {
                  actions.onMinZoomChange?.(layer.id, zoom);
                }
              }}
              className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer accent-accent-gold"
              data-no-shortcut="true"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-bone-dark/70">Max Zoom</span>
              <span className="text-xs font-display font-semibold text-accent-gold">
                {layer.maxZoom}%
              </span>
            </div>
            <input
              id={`layer-max-zoom-${layer.id}`}
              name={`layerMaxZoom-${layer.id}`}
              type="range"
              min="0"
              max="200"
              value={layer.maxZoom}
              onChange={(e) => {
                const zoom = parseInt(e.target.value);
                if (zoom >= layer.minZoom) {
                  actions.onMaxZoomChange?.(layer.id, zoom);
                }
              }}
              className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer accent-accent-gold"
              data-no-shortcut="true"
            />
          </div>
          <div className="text-xs text-bone-dark/70">
            Visible at{" "}
            <span className="text-accent-gold font-semibold">
              {layer.minZoom}% - {layer.maxZoom}%
            </span>{" "}
            zoom
          </div>
        </div>
      )}

      {/* Layer Info */}
      <div className="space-y-1.5 text-xs pt-2 border-t border-iron/30">
        <div className="flex items-center justify-between">
          <span className="text-bone-dark">Status</span>
          <span
            className={cn(
              "font-medium font-display",
              layer.visible ? "text-accent-gold" : "text-bone-dark/50"
            )}
          >
            {layer.visible ? "Visible" : "Hidden"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-bone-dark">Locked</span>
          <span
            className={cn(
              "flex items-center gap-1 font-medium font-display",
              layer.locked ? "text-bone-dark/50" : "text-accent-gold"
            )}
          >
            {layer.locked ? (
              <Lock className="w-3 h-3" />
            ) : (
              <Unlock className="w-3 h-3" />
            )}
            {layer.locked ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
