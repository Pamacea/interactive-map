"use client";

import { Lock, Unlock } from "lucide-react";
import { Layer } from "../../types/layer-types";

interface LayerPropertiesPanelProps {
  layer: Layer;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onScaleChange?: (layerId: string, scale: number) => void;
  onPositionChange?: (layerId: string, offsetX: number, offsetY: number) => void;
  onMinZoomChange?: (layerId: string, minZoom: number) => void;
  onMaxZoomChange?: (layerId: string, maxZoom: number) => void;
  onZoomReset?: (layerId: string) => void;
}

export function LayerPropertiesPanel({
  layer,
  onOpacityChange,
  onScaleChange,
  onPositionChange,
  onMinZoomChange,
  onMaxZoomChange,
  onZoomReset,
}: LayerPropertiesPanelProps) {
  return (
    <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Position Controls */}
      {onPositionChange && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Position (X, Y)</span>
            <span className="text-bone font-medium font-display">
              {layer.offsetX}px, {layer.offsetY}px
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 grid gap-1">
              <label htmlFor={`x-offset-${layer.id}`} className="text-xs text-bone-dark">
                X Offset
              </label>
              <input
                id={`x-offset-${layer.id}`}
                type="number"
                value={layer.offsetX}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  onPositionChange(layer.id, val, layer.offsetY);
                }}
                className="w-full h-8 px-2 text-sm bg-void border border-iron rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-bone"
                min="-5000"
                max="5000"
                aria-label="X offset"
              />
            </div>
            <div className="flex-1 grid gap-1">
              <label htmlFor={`y-offset-${layer.id}`} className="text-xs text-bone-dark">
                Y Offset
              </label>
              <input
                id={`y-offset-${layer.id}`}
                type="number"
                value={layer.offsetY}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  onPositionChange(layer.id, layer.offsetX, val);
                }}
                className="w-full h-8 px-2 text-sm bg-void border border-iron rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold text-bone"
                min="-5000"
                max="5000"
                aria-label="Y offset"
              />
            </div>
          </div>
        </div>
      )}

      {/* Opacity Control */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-bone-dark">Opacity</span>
          <span className="text-bone font-medium font-display">
            {Math.round(layer.opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={layer.opacity * 100}
          onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value) / 100)}
          className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
          aria-label={`Layer opacity: ${Math.round(layer.opacity * 100)}%`}
        />
      </div>

      {/* Scale Control */}
      {onScaleChange && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Scale</span>
            <span className="text-bone font-medium font-display">
              {Math.round(layer.scale * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={layer.scale * 100}
            onChange={(e) => onScaleChange(layer.id, parseInt(e.target.value) / 100)}
            className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            aria-label={`Layer scale: ${Math.round(layer.scale * 100)}%`}
          />
        </div>
      )}

      {/* Zoom Visibility Control */}
      {(onMinZoomChange || onMaxZoomChange) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-bone-dark">Zoom Visibility</span>
            {onZoomReset && (
              <button
                type="button"
                onClick={() => onZoomReset(layer.id)}
                className="text-xs text-accent-gold/70 hover:text-accent-gold transition-colors flex items-center gap-1"
              >
                <span className="text-accent-gold/40 text-xs">ᛟ</span>
                Reset
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-bone-dark/70">Min Zoom</span>
              <span className="text-xs font-display font-semibold text-accent-gold">{layer.minZoom}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={layer.minZoom}
              onChange={(e) => {
                const zoom = parseInt(e.target.value);
                if (onMinZoomChange && zoom < layer.maxZoom) {
                  onMinZoomChange(layer.id, zoom);
                }
              }}
              className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer accent-accent-gold"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-bone-dark/70">Max Zoom</span>
              <span className="text-xs font-display font-semibold text-accent-gold">{layer.maxZoom}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={layer.maxZoom}
              onChange={(e) => {
                const zoom = parseInt(e.target.value);
                if (onMaxZoomChange && zoom > layer.minZoom) {
                  onMaxZoomChange(layer.id, zoom);
                }
              }}
              className="w-full h-1.5 bg-void rounded-sm appearance-none cursor-pointer accent-accent-gold"
            />
          </div>
          <div className="text-xs text-bone-dark/70">
            Visible at <span className="text-accent-gold font-semibold">{layer.minZoom}% - {layer.maxZoom}%</span> zoom
          </div>
        </div>
      )}

      {/* Layer Info */}
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-bone-dark">Status</span>
          <span className={`font-medium font-display ${layer.visible ? "text-accent-gold" : "text-bone-dark/50"}`}>
            {layer.visible ? "Visible" : "Hidden"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-bone-dark">Locked</span>
          <span className={`flex items-center gap-1 font-medium font-display ${layer.locked ? "text-bone-dark/50" : "text-accent-gold"}`}>
            {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {layer.locked ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
