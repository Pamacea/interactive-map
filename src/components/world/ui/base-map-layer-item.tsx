"use client";

import { useState, useCallback } from "react";
import { Eye, EyeOff, Lock, Upload, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface BaseMapLayerItemProps {
  mapImage: string | null;
  isVisible: boolean;
  isLocked?: boolean;
  opacity: number;
  scale: number;
  onToggleVisibility: () => void;
  onOpacityChange: (opacity: number) => void;
  onScaleChange: (scale: number) => void;
  onUploadMap?: () => void;
}

export function BaseMapLayerItem({
  mapImage,
  isVisible,
  isLocked = true,
  opacity,
  scale,
  onToggleVisibility,
  onOpacityChange,
  onScaleChange,
  onUploadMap,
}: BaseMapLayerItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleOpacityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newOpacity = parseInt(e.target.value) / 100;
      onOpacityChange(newOpacity);
    },
    [onOpacityChange]
  );

  const handleScaleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newScale = parseInt(e.target.value) / 100;
      onScaleChange(newScale);
    },
    [onScaleChange]
  );

  const handleResetScale = useCallback(() => {
    onScaleChange(1.0);
  }, [onScaleChange]);

  return (
    <div className="group relative rounded-sm bg-background-elevated overflow-hidden">
      {/* Header - Always Visible */}
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-background-card-hover transition-colors cursor-pointer"
        onClick={handleToggleExpand}
      >
        {/* Expand/Collapse Icon */}
        <button className="p-0.5 hover:bg-background-base rounded-sm transition-colors">
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
          )}
        </button>

        {/* Layer Color Indicator */}
        <div className="w-2 h-2 rounded-full bg-accent-gold" />

        {/* Thumbnail/Preview */}
        <div className="w-12 h-12 rounded-sm bg-background-base border border-border-tertiary overflow-hidden flex-shrink-0">
          {mapImage ? (
            <Image
              src={mapImage}
              alt="Base map preview"
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Upload className="w-4 h-4 text-text-muted" />
            </div>
          )}
        </div>

        {/* Layer Name */}
        <span
          className={`flex-1 text-sm font-medium ${
            isVisible ? "text-text-secondary" : "text-text-muted"
          }`}
        >
          Base Map
        </span>

        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className="p-1 hover:bg-background-base rounded-sm transition-colors"
          title={isVisible ? "Hide layer" : "Show layer"}
        >
          {isVisible ? (
            <Eye className="w-3.5 h-3.5 text-text-muted" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-text-muted" />
          )}
        </button>

        {/* Lock Indicator */}
        {isLocked && (
          <div className="p-1" title="Layer is locked">
            <Lock className="w-3 h-3 text-text-muted" />
          </div>
        )}

        {/* Upload Button (on hover) */}
        {onUploadMap && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUploadMap();
            }}
            className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100"
            title="Upload new map"
          >
            <Upload className="w-3.5 h-3.5 text-accent-gold" />
          </button>
        )}
      </div>

      {/* Properties Panel - Expandable */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Opacity Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Opacity</span>
              <span className="text-text-secondary font-medium">
                {Math.round(opacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity * 100}
              onChange={handleOpacityChange}
              className="w-full h-1.5 bg-background-base rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            />
          </div>

          {/* Size Control */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Size</span>
              <div className="flex items-center gap-2">
                <span className="text-text-secondary font-medium">
                  {Math.round(scale * 100)}%
                </span>
                {scale !== 1.0 && (
                  <button
                    onClick={handleResetScale}
                    className="text-xs text-accent-gold hover:text-accent-gold/80 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="200"
              step="5"
              value={scale * 100}
              onChange={handleScaleChange}
              className="w-full h-1.5 bg-background-base rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
            />
          </div>

          {/* Layer Info */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Position</span>
              <span className="flex items-center gap-1 font-medium text-text-muted">
                <Lock className="w-3 h-3" />
                Fixed (0, 0)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Status</span>
              <span className={`font-medium ${isVisible ? "text-accent-gold" : "text-text-muted"}`}>
                {isVisible ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Locked</span>
              <span className="flex items-center gap-1 font-medium text-text-muted">
                <Lock className="w-3 h-3" />
                Yes
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
