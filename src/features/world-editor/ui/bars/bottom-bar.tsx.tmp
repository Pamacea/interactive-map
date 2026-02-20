import { useCallback, useMemo } from "react";
import { UndoRedoControl } from "./undo-redo-control";
import { ZoomControl } from "./zoom-control";
import { CompactScaleSelector, ScaleOption, SCALE_TO_ZOOM, ZOOM_TO_SCALE } from "./scale-selector";
import { HelpButton } from "./help-button";
import { cn } from "@/shared/utils";

function getNearestScale(zoom: number): ScaleOption {
  if (zoom >= 3.0) return "1:1";
  if (zoom >= 1.5) return "1:10";
  if (zoom >= 0.75) return "1:100";
  if (zoom >= 0.35) return "1:1000";
  return "1:10000";
}

export interface BottomBarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  scaleOption: ScaleOption;
  onScaleChange: (scale: ScaleOption) => void;
  onReset?: () => void;
  onHelpToggle?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  className?: string;
}

export function BottomBar({
  zoom,
  onZoomChange,
  scaleOption,
  onScaleChange,
  onReset,
  onHelpToggle,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  className,
}: BottomBarProps) {
  const handleUndo = useCallback(() => {
    onUndo?.();
  }, [onUndo]);

  const handleRedo = useCallback(() => {
    onRedo?.();
  }, [onRedo]);

  const handleScaleChange = useCallback(
    (newScale: ScaleOption) => {
      onScaleChange(newScale);
      const newZoom = SCALE_TO_ZOOM[newScale];
      onZoomChange(newZoom);
    },
    [onZoomChange, onScaleChange]
  );

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      onZoomChange(newZoom);
      // Update scale option to nearest match
      const nearestScale = getNearestScale(newZoom);
      if (nearestScale !== scaleOption) {
        onScaleChange(nearestScale);
      }
    },
    [onZoomChange, scaleOption, onScaleChange]
  );

  // Prevent map interactions when interacting with the bottom bar
  const handleInteraction = useMemo(() => ((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }), []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 h-12 bg-obsidian/95 backdrop-blur-md border-t border-iron/50 flex items-center justify-between px-4 z-40",
        className
      )}
      onMouseDown={handleInteraction}
      onMouseUp={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchEnd={handleInteraction}
      onTouchMove={handleInteraction}
      role="toolbar"
      aria-label="Map controls"
    >
      {/* Left: Undo/Redo */}
      <div className="flex items-center gap-2">
        <UndoRedoControl
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </div>

      {/* Center: Zoom control */}
      <div className="flex items-center justify-center flex-1">
        <ZoomControl
          value={zoom}
          onChange={handleZoomChange}
          onReset={onReset}
          compact
        />
      </div>

      {/* Right: Scale selector + Help */}
      <div className="flex items-center gap-2">
        <CompactScaleSelector value={scaleOption} onChange={handleScaleChange} />
        {onHelpToggle && <HelpButton onClick={onHelpToggle} />}
      </div>
    </div>
  );
}
