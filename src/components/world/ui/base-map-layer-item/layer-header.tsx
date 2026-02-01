import { Eye, EyeOff, Lock, Upload, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface LayerHeaderProps {
  mapImage: string | null;
  isVisible: boolean;
  isLocked: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: (e: React.MouseEvent) => void;
  onUploadMap?: (e: React.MouseEvent) => void;
}

export function LayerHeader({
  mapImage,
  isVisible,
  isLocked,
  isExpanded,
  onToggleExpand,
  onToggleVisibility,
  onUploadMap,
}: LayerHeaderProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 hover:bg-background-card-hover transition-colors cursor-pointer"
      onClick={onToggleExpand}
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
      <div className="w-2 h-2 rounded-sm bg-accent-gold" />

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
        onClick={onToggleVisibility}
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
          onClick={onUploadMap}
          className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100"
          title="Upload new map"
        >
          <Upload className="w-3.5 h-3.5 text-accent-gold" />
        </button>
      )}
    </div>
  );
}
