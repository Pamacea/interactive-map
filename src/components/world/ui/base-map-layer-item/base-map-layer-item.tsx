"use client";

import { useState, useCallback } from "react";
import { LayerHeader } from "./layer-header";
import { LayerProperties } from "./layer-properties";

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

  const handleToggleVisibility = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleVisibility();
    },
    [onToggleVisibility]
  );

  const handleUploadMap = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onUploadMap?.();
    },
    [onUploadMap]
  );

  return (
    <div className="group relative rounded-sm bg-obsidian/70 border border-iron/50 overflow-hidden hover:border-accent-gold/30 transition-colors">
      <LayerHeader
        mapImage={mapImage}
        isVisible={isVisible}
        isLocked={isLocked}
        isExpanded={isExpanded}
        onToggleExpand={handleToggleExpand}
        onToggleVisibility={handleToggleVisibility}
        onUploadMap={onUploadMap ? handleUploadMap : undefined}
      />

      {isExpanded && (
        <LayerProperties
          opacity={opacity}
          scale={scale}
          isVisible={isVisible}
          isLocked={isLocked}
          onOpacityChange={handleOpacityChange}
          onScaleChange={handleScaleChange}
          onResetScale={handleResetScale}
        />
      )}
    </div>
  );
}
