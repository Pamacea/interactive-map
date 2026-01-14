"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, ChevronUp, ChevronDown, X, Upload, ChevronRight } from "lucide-react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
  isBaseMap?: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
}

interface LayerItemProps {
  layer: Layer;
  index: number;
  isConfirmingDelete: boolean;
  layerColor: string;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onScaleChange?: (layerId: string, scale: number) => void;
  onPositionChange?: (layerId: string, offsetX: number, offsetY: number) => void;
  onMoveUp: (layerId: string) => void;
  onMoveDown: (layerId: string) => void;
  onDeleteConfirm: (layerId: string) => void;
  onDeleteCancel: () => void;
  onStartDelete: (layerId: string) => void;
  totalLayers: number;
  onUploadMap?: () => void;
}

export function LayerItem({
  layer,
  index,
  isConfirmingDelete,
  layerColor,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onScaleChange,
  onPositionChange,
  onMoveUp,
  onMoveDown,
  onDeleteConfirm,
  onDeleteCancel,
  onStartDelete,
  totalLayers,
  onUploadMap,
}: LayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      key={layer.id}
      className="group relative rounded-sm bg-background-elevated overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 hover:bg-background-card-hover transition-colors">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0.5 hover:bg-background-base rounded-sm transition-colors"
        >
          <ChevronRight
            className={`w-3.5 h-3.5 text-text-muted transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </button>

        <div className={`w-2 h-2 rounded-full ${layerColor}`} />

        <span
          className={`flex-1 text-sm truncate ${
            layer.visible ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          {layer.name}
        </span>

        {/* Position indicator */}
        {(layer.offsetX !== 0 || layer.offsetY !== 0) && (
          <span className="text-xs text-accent-gold font-medium">
            ({layer.offsetX}, {layer.offsetY})
          </span>
        )}

        {/* Scale indicator */}
        {layer.scale !== 1.0 && (
          <span className="text-xs text-accent-gold font-medium">
            {Math.round(layer.scale * 100)}%
          </span>
        )}

        {!isConfirmingDelete ? (
          <>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {layer.isBaseMap && onUploadMap ? (
                <button
                  onClick={onUploadMap}
                  className="p-1 hover:bg-background-base rounded-sm transition-colors"
                  title="Upload new map"
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
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
                    </button>
                    <button
                      onClick={() => onMoveDown(layer.id)}
                      disabled={index === totalLayers - 1}
                      className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                    </button>
                  </>
                )
              )}
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={layer.opacity * 100}
              onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value) / 100)}
              className="w-16 h-1 bg-background-base rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold"
              title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
            />

            <button
              onClick={() => onToggleVisibility(layer.id)}
              className="p-1 hover:bg-background-base rounded-sm transition-colors"
              title={layer.visible ? "Hide layer" : "Show layer"}
            >
              {layer.visible ? (
                <Eye className="w-3.5 h-3.5 text-text-muted" />
              ) : (
                <EyeOff className="w-3.5 h-3.5 text-text-muted" />
              )}
            </button>

            <button
              onClick={() => onToggleLock(layer.id)}
              className="p-1 hover:bg-background-base rounded-sm transition-colors"
              title={layer.locked ? "Unlock layer" : "Lock layer"}
            >
              {layer.locked ? (
                <Lock className="w-3 h-3 text-text-muted" />
              ) : (
                <Unlock className="w-3 h-3 text-text-muted" />
              )}
            </button>

            {!layer.isBaseMap && (
              <button
                onClick={() => onStartDelete(layer.id)}
                className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                title="Delete layer"
              >
                <Trash2 className="w-3 h-3 text-text-muted hover:text-rose-500" />
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
            <button
              onClick={() => onDeleteConfirm(layer.id)}
              className="px-2 py-1 text-xs bg-rose-600 text-white rounded-sm hover:bg-rose-700 transition-colors font-medium"
            >
              Delete
            </button>
            <button
              onClick={onDeleteCancel}
              className="p-1 hover:bg-background-base rounded-sm transition-colors text-text-muted hover:text-text-secondary"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Properties Panel - Expandable */}
      {isExpanded && !layer.isBaseMap && (
        <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Position Controls */}
          {onPositionChange && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Position (X, Y)</span>
                <span className="text-text-secondary font-medium">
                  {layer.offsetX}px, {layer.offsetY}px
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 grid gap-1">
                  <label className="text-xs text-text-muted">X Offset</label>
                  <input
                    type="number"
                    value={layer.offsetX}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      onPositionChange(layer.id, val, layer.offsetY);
                    }}
                    className="w-full h-8 px-2 text-sm bg-background-base border border-border-tertiary rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold"
                    min="-5000"
                    max="5000"
                  />
                </div>
                <div className="flex-1 grid gap-1">
                  <label className="text-xs text-text-muted">Y Offset</label>
                  <input
                    type="number"
                    value={layer.offsetY}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      onPositionChange(layer.id, layer.offsetX, val);
                    }}
                    className="w-full h-8 px-2 text-sm bg-background-base border border-border-tertiary rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold"
                    min="-5000"
                    max="5000"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Opacity Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Opacity</span>
              <span className="text-text-secondary font-medium">
                {Math.round(layer.opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={layer.opacity * 100}
              onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value) / 100)}
              className="w-full h-1.5 bg-background-base rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            />
          </div>

          {/* Scale Control */}
          {onScaleChange && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">Scale</span>
                <span className="text-text-secondary font-medium">
                  {Math.round(layer.scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="200"
                value={layer.scale * 100}
                onChange={(e) => onScaleChange(layer.id, parseInt(e.target.value) / 100)}
                className="w-full h-1.5 bg-background-base rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
              />
            </div>
          )}

          {/* Layer Info */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Status</span>
              <span className={`font-medium ${layer.visible ? "text-accent-gold" : "text-text-muted"}`}>
                {layer.visible ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Locked</span>
              <span className={`flex items-center gap-1 font-medium ${layer.locked ? "text-text-muted" : "text-accent-gold"}`}>
                {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                {layer.locked ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
