/**
 * Layer Item with Count - Layer row showing item counts
 * @module layers/layer-item-with-count
 *
 * UX: Default view shows minimal controls (name, visibility)
 * Advanced controls (lock, delete, expand) appear on hover
 */

"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/shared/utils";
import { Eye, EyeOff, Lock, Unlock, MapPin, Image, Square, ChevronDown, Trash2 } from "lucide-react";
import type { LayerActions, UILayer } from "./layer-types";

interface LayerContentCounts {
  pins: number;
  images: number;
  regions: number;
  total: number;
}

interface LayerItemWithCountProps {
  layer: UILayer & { contentCounts?: LayerContentCounts };
  index?: number;
  totalLayers?: number;
  isActive?: boolean;
  actions: LayerActions;
  onExpand?: () => void;
  isExpanded?: boolean;
  showContentPreview?: boolean;
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

export function LayerItemWithCount({
  layer,
  isActive = false,
  actions,
  onExpand,
  isExpanded = false,
  showContentPreview = false,
}: LayerItemWithCountProps) {
  const counts = layer.contentCounts || { pins: 0, images: 0, regions: 0, total: 0 };

  // Generate display name with fallback
  const displayName = useMemo(() => getLayerDisplayName(layer), [layer]);

  const _handleToggleVisibility = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onToggleVisibility(layer.id);
  }, [actions, layer.id]);

  const handleToggleLock = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    actions.onToggleLock(layer.id);
  }, [actions, layer.id]);

  const handleSelect = useCallback(() => {
    if (actions.onSelect) {
      actions.onSelect(layer.id);
    }
  }, [actions, layer.id]);

  const handleExpand = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand?.();
  }, [onExpand]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (actions.onDelete) {
      actions.onDelete(layer.id);
    }
  }, [actions, layer.id]);

  // Determine icon based on layer type
  const getLayerIcon = () => {
    if (layer.isBaseMap || layer.type === "BASE_MAP") {
      return null; // Base map has special handling
    }
    switch (layer.type) {
      case "MARKERS":
        return <MapPin className="w-3.5 h-3.5" aria-hidden="true" />;
      case "IMAGES":
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image className="w-3.5 h-3.5" aria-hidden="true" />;
      case "REGIONS":
        return <Square className="w-3.5 h-3.5" aria-hidden="true" />;
      default:
        return <div className="w-3.5 h-3.5 rounded-sm bg-current" />;
    }
  };

  // Get layer color based on type
  const getLayerColorClass = () => {
    if (layer.isBaseMap || layer.type === "BASE_MAP") {
      return "text-accent-gold";
    }
    switch (layer.type) {
      case "MARKERS":
        return "text-amber-500";
      case "IMAGES":
        return "text-emerald-500";
      case "REGIONS":
        return "text-purple-500";
      default:
        return "text-blue-500";
    }
  };

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
        {layer.isBaseMap || layer.type === "BASE_MAP" ? (
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
        ) : (
          <div className={cn("flex-shrink-0", getLayerColorClass())}>
            {getLayerIcon()}
          </div>
        )}

        {/* Layer Name */}
        <span
          className={cn(
            "flex-1 text-sm truncate font-fell",
            layer.visible ? "text-bone-dark" : "text-bone-dark/50"
          )}
          title={displayName}
        >
          {displayName}
        </span>

        {/* Item Counts - Badge */}
        {counts.total > 0 && (
          <div className="flex items-center gap-1 mr-1">
            {counts.pins > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-mono"
                title={`${counts.pins} pins`}
              >
                <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                {counts.pins}
              </span>
            )}
            {counts.images > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono"
                title={`${counts.images} images`}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image className="w-2.5 h-2.5 inline mr-0.5" aria-hidden="true" />
                {counts.images}
              </span>
            )}
            {counts.regions > 0 && (
              <span
                className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-mono"
                title={`${counts.regions} regions`}
              >
                <Square className="w-2.5 h-2.5 inline mr-0.5" />
                {counts.regions}
              </span>
            )}
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
          {layer.visible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Advanced controls - Visible on hover only */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Lock Toggle - only for non-base layers */}
          {!layer.isBaseMap && layer.type !== "BASE_MAP" && (
            <button
              onClick={handleToggleLock}
              className={cn(
                "p-1 rounded transition-colors",
                "hover:bg-iron/50",
                layer.locked ? "text-accent-gold" : "text-bone-dark/50"
              )}
              title={layer.locked ? "Unlock layer" : "Lock layer"}
            >
              {layer.locked ? (
                <Lock className="w-3 h-3" />
              ) : (
                <Unlock className="w-3 h-3" />
              )}
            </button>
          )}

          {/* Expand Button - if has content */}
          {(counts.total > 0 || showContentPreview) && (
            <button
              onClick={handleExpand}
              className={cn(
                "p-1 rounded transition-colors",
                "hover:bg-iron/50 text-bone-dark/50"
              )}
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <ChevronDown
                className={cn(
                  "w-3 h-3 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          )}

          {/* Delete Button - only for non-base, non-locked layers */}
          {!layer.isBaseMap &&
            layer.type !== "BASE_MAP" &&
            !layer.locked &&
            actions.onDelete && (
              <button
                onClick={handleDelete}
                className="p-1 rounded transition-colors hover:bg-red-500/20 text-bone-dark/30 hover:text-red-400"
                title="Delete layer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
        </div>
      </div>

      {/* Content Preview - when expanded */}
      {isExpanded && showContentPreview && counts.total > 0 && (
        <div className="px-3 pb-2 border-t border-iron/20 mt-1 pt-2">
          <div className="text-xs text-bone-dark/50 font-mono mb-1">
            Content preview
          </div>
          {/* This would show the actual items in the layer */}
          <div className="text-xs text-bone-dark/70 italic">
            {counts.pins > 0 && `${counts.pins} pin${counts.pins > 1 ? "s" : ""}`}
            {counts.pins > 0 && counts.images > 0 && ", "}
            {counts.images > 0 && `${counts.images} image${counts.images > 1 ? "s" : ""}`}
            {(counts.pins > 0 || counts.images > 0) && counts.regions > 0 && ", "}
            {counts.regions > 0 && `${counts.regions} region${counts.regions > 1 ? "s" : ""}`}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact Layer Item - For collapsed sidebar view
 */
interface CompactLayerItemProps {
  layer: UILayer;
  isActive?: boolean;
  actions: LayerActions;
}

export function CompactLayerItem({ layer, isActive, actions }: CompactLayerItemProps) {
  const _handleToggleVisibility = useCallback(() => {
    actions.onToggleVisibility(layer.id);
  }, [actions, layer.id]);

  const handleSelect = useCallback(() => {
    if (actions.onSelect) {
      actions.onSelect(layer.id);
    }
  }, [actions, layer.id]);

  // Get display name with fallback
  const displayName = getLayerDisplayName(layer);

  return (
    <button
      onClick={handleSelect}
      className={cn(
        "w-full p-2 rounded transition-all duration-200",
        "hover:bg-iron/30",
        layer.visible
          ? "bg-stone/50"
          : "bg-stone/30 opacity-60",
        isActive && "ring-1 ring-accent-gold/50"
      )}
      title={displayName}
    >
      {layer.isBaseMap || layer.type === "BASE_MAP" ? (
        <svg
          className="w-4 h-4 text-accent-gold mx-auto"
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
      ) : (
        <div
          className={cn(
            "w-4 h-4 rounded-sm mx-auto",
            layer.visible ? "bg-accent-gold/80" : "bg-bone-dark/30"
          )}
        />
      )}
    </button>
  );
}
