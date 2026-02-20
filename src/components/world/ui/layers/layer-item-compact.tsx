/**
 * Layer Item Compact - Simplified layer row with hover-only controls
 * @module layers/layer-item-compact
 *
 * UX Improvements:
 * - Default view: name + visibility toggle + item count badge
 * - Hover view: shows advanced controls (lock, move, delete)
 * - Fallback names for empty layer names
 * - Clean, uncluttered interface
 */

"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Lock, Unlock, ChevronUp, ChevronDown, Trash2, MapPin, Image, Square } from "lucide-react";
import type { UILayer, LayerContentCounts } from "./layer-types";

interface LayerActions {
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onMoveUp?: (layerId: string) => void;
  onMoveDown?: (layerId: string) => void;
  onDelete?: (layerId: string) => void;
  onSelect?: (layerId: string) => void;
}

interface LayerItemCompactProps {
  layer: UILayer & { contentCounts?: LayerContentCounts };
  index: number;
  totalLayers: number;
  isActive?: boolean;
  actions: LayerActions;
}

/**
 * Get a fallback name for empty layer names based on type
 */
function getLayerDisplayName(layer: UILayer): string {
  if (layer.name && layer.name.trim()) return layer.name;

  const typeNames: Record<string, string> = {
    "BASE_MAP": "Base Map",
    "MARKERS": "Markers",
    "IMAGES": "Images",
    "REGIONS": "Regions",
    "GROUP": "Group",
    "CUSTOM": "Untitled Layer",
  };

  return typeNames[layer.type || "CUSTOM"] || "Untitled Layer";
}

/**
 * Get layer icon based on type
 */
function getLayerIcon(layer: UILayer) {
  if (layer.isBaseMap || layer.type === "BASE_MAP") {
    return (
      <svg
        className="w-4 h-4 text-accent-gold flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    );
  }

  const iconMap = {
    "MARKERS": <MapPin className="w-3.5 h-3.5" aria-hidden="true" />,
    // eslint-disable-next-line jsx-a11y/alt-text
    "IMAGES": <Image className="w-3.5 h-3.5" aria-hidden="true" />,
    "REGIONS": <Square className="w-3.5 h-3.5" aria-hidden="true" />,
  };

  return iconMap[layer.type || "CUSTOM"] || (
    <div className="w-3.5 h-3.5 rounded-sm bg-current" />
  );
}

/**
 * Get layer color class based on type
 */
function getLayerColorClass(layer: UILayer): string {
  if (layer.isBaseMap || layer.type === "BASE_MAP") {
    return "text-accent-gold";
  }

  const colorMap: Record<string, string> = {
    "MARKERS": "text-amber-500",
    "IMAGES": "text-emerald-500",
    "REGIONS": "text-purple-500",
    "CUSTOM": "text-blue-500",
  };

  return colorMap[layer.type || "CUSTOM"] || "text-blue-500";
}

/**
 * Count badge component for layer content
 */
function CountBadge({ type, count }: { type: string; count: number }) {
  if (count === 0) return null;

  const badgeConfig = {
    pins: { bg: "bg-amber-500/20", text: "text-amber-400", icon: <MapPin className="w-2 h-2" aria-hidden="true" /> },
    // eslint-disable-next-line jsx-a11y/alt-text
    images: { bg: "bg-emerald-500/20", text: "text-emerald-400", icon: <Image className="w-2 h-2" aria-hidden="true" /> },
    regions: { bg: "bg-purple-500/20", text: "text-purple-400", icon: <Square className="w-2 h-2" aria-hidden="true" /> },
  };

  const config = badgeConfig[type as keyof typeof badgeConfig];

  return (
    <span
      className={cn(
        "flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-mono",
        config.bg, config.text
      )}
      title={`${count} ${type}`}
    >
      {config.icon}
      {count}
    </span>
  );
}

export function LayerItemCompact({
  layer,
  index,
  totalLayers,
  isActive = false,
  actions,
}: LayerItemCompactProps) {
  const counts = layer.contentCounts || { pins: 0, images: 0, regions: 0, total: 0 };
  const displayName = useMemo(() => getLayerDisplayName(layer), [layer]);
  const layerColor = useMemo(() => getLayerColorClass(layer), [layer]);

  const canMoveUp = index > 0 && !layer.isBaseMap;
  const canMoveDown = index < totalLayers - 1 && !layer.isBaseMap;

  const _handleToggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onToggleVisibility(layer.id);
  }, [actions, layer.id]);

  const handleToggleLock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onToggleLock(layer.id);
  }, [actions, layer.id]);

  const handleMoveUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onMoveUp?.(layer.id);
  }, [actions, layer.id]);

  const handleMoveDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onMoveDown?.(layer.id);
  }, [actions, layer.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onDelete?.(layer.id);
  }, [actions, layer.id]);

  const handleSelect = useCallback(() => {
    if (actions.onSelect) {
      actions.onSelect(layer.id);
    }
  }, [actions, layer.id]);

  return (
    <div
      className={cn(
        "group relative rounded-sm border transition-all duration-200",
        "hover:border-iron/70",
        layer.visible
          ? "bg-stone/50 border-iron/30"
          : "bg-stone/30 border-iron/20",
        isActive && "ring-1 ring-accent-gold/50"
      )}
      onClick={handleSelect}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Layer Icon */}
        <div className={cn("flex-shrink-0", layerColor)}>
          {getLayerIcon(layer)}
        </div>

        {/* Layer Name */}
        <span
          className={cn(
            "flex-1 text-sm truncate font-fell min-w-0",
            layer.visible ? "text-bone-dark" : "text-bone-dark/50"
          )}
          title={displayName}
        >
          {displayName}
        </span>

        {/* Item Counts - Badge */}
        {counts.total > 0 && (
          <div className="flex items-center gap-1 mr-1">
            {counts.pins > 0 && <CountBadge type="pins" count={counts.pins} />}
            {counts.images > 0 && <CountBadge type="images" count={counts.images} />}
            {counts.regions > 0 && <CountBadge type="regions" count={counts.regions} />}
          </div>
        )}

        {/* Visibility Toggle - Always visible */}
        <button
          onClick={handleToggleVisibility}
          className={cn(
            "p-1 rounded transition-colors flex-shrink-0",
            "hover:bg-iron/50",
            layer.visible ? "text-bone-dark" : "text-bone-dark/30"
          )}
          title={layer.visible ? "Hide layer" : "Show layer"}
        >
          {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        {/* Advanced Controls - Visible on hover only */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Lock Toggle */}
          {!layer.isBaseMap && (
            <button
              onClick={handleToggleLock}
              className={cn(
                "p-1 rounded transition-colors flex-shrink-0",
                "hover:bg-iron/50",
                layer.locked ? "text-accent-gold" : "text-bone-dark/50"
              )}
              title={layer.locked ? "Unlock layer" : "Lock layer"}
            >
              {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </button>
          )}

          {/* Move Up */}
          {canMoveUp && (
            <button
              onClick={handleMoveUp}
              className="p-1 rounded transition-colors text-bone-dark/50 hover:text-accent-gold hover:bg-iron/50 flex-shrink-0"
              title="Move up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
          )}

          {/* Move Down */}
          {canMoveDown && (
            <button
              onClick={handleMoveDown}
              className="p-1 rounded transition-colors text-bone-dark/50 hover:text-accent-gold hover:bg-iron/50 flex-shrink-0"
              title="Move down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          )}

          {/* Delete */}
          {!layer.isBaseMap && !layer.locked && actions.onDelete && (
            <button
              onClick={handleDelete}
              className="p-1 rounded transition-colors text-bone-dark/30 hover:text-rose-400 hover:bg-rose-500/10 flex-shrink-0"
              title="Delete layer"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
