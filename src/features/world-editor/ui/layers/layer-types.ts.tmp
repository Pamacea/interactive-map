/**
 * Layer Types - Unified type definitions for the Layers system
 * @module layers/types
 */

import type { Layer } from "@/features/world-editor/types/layer-types";

/**
 * Layer type enum - matches Prisma schema
 */
export type LayerType = "BASE_MAP" | "MARKERS" | "IMAGES" | "REGIONS" | "GROUP" | "CUSTOM";

/**
 * Visual variant for layer display
 */
export type LayerVariant = "compact" | "expanded" | "docked";

/**
 * Layer display mode based on container state
 */
export interface LayerDisplayMode {
  variant: LayerVariant;
  showLabels: boolean;
  showProperties: boolean;
  isCollapsed: boolean;
}

/**
 * Layer content counts
 */
export interface LayerContentCounts {
  pins: number;
  images: number;
  regions: number;
  total: number;
}

/**
 * Extended layer interface with type and counts
 */
export interface ExtendedLayer extends Layer {
  type: LayerType;
  contentCounts?: LayerContentCounts;
}

/**
 * Extended layer with UI state
 */
export interface UILayer extends ExtendedLayer {
  isSelected?: boolean;
  isDragging?: boolean;
}

/**
 * Layer action handlers
 */
export interface LayerActions {
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onMinZoomChange?: (layerId: string, minZoom: number) => void;
  onMaxZoomChange?: (layerId: string, maxZoom: number) => void;
  onResetZoom?: (layerId: string) => void;
  onMoveUp?: (layerId: string) => void;
  onMoveDown?: (layerId: string) => void;
  onDelete?: (layerId: string) => void;
  onRename?: (layerId: string, name: string) => void;
  onDuplicate?: (layerId: string) => void;
  onSelect?: (layerId: string) => void;
  onExpand?: (layerId: string) => void;
  onMoveItemToLayer?: (itemId: string, itemType: "pin" | "image" | "region", targetLayerId: string) => Promise<void>;
  onDragStart?: (layerId: string, index: number) => void;
  onDragOver?: (layerId: string, index: number) => void;
  onDragEnd?: () => void;
  onDrop?: (draggedLayerId: string, targetLayerId: string) => void;
}

/**
 * Draggable item type for layer content
 */
export type DraggableItemType = "pin" | "image" | "region";

/**
 * Draggable item data
 */
export interface DraggableItem {
  id: string;
  type: DraggableItemType;
  name: string;
  pinType?: string;
  imageUrl?: string;
  regionType?: string;
  color?: string;
}

/**
 * Props for layer row component
 */
export interface LayerRowProps {
  layer: UILayer;
  index: number;
  totalLayers: number;
  displayMode: LayerDisplayMode;
  layerColor?: string;
  isConfirmingDelete?: boolean;
  actions: LayerActions;
  children?: React.ReactNode;
}

/**
 * Props for layer list container
 */
export interface LayerListProps {
  layers: UILayer[];
  selectedLayerId: string | null;
  displayMode: LayerDisplayMode;
  onLayerSelect?: (layerId: string | null) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  renderLayerActions?: (layer: UILayer) => React.ReactNode;
  renderAddButton?: () => React.ReactNode;
  className?: string;
}

/**
 * Layer preset templates
 */
export interface LayerPreset {
  id: string;
  name: string;
  icon: string;
  color: string;
  defaultOpacity: number;
  type: LayerType;
  description?: string;
}

export const LAYER_PRESETS: Record<string, LayerPreset> = {
  baseMap: {
    id: "base-map",
    name: "Base Map",
    icon: "map",
    color: "#f59e0b",
    defaultOpacity: 1,
    type: "BASE_MAP",
    description: "The main map background image",
  },
  markers: {
    id: "markers",
    name: "Markers",
    icon: "map-pin",
    color: "#f59e0b",
    defaultOpacity: 1,
    type: "MARKERS",
    description: "Points of interest and locations",
  },
  images: {
    id: "images",
    name: "Images",
    icon: "image",
    color: "#10b981",
    defaultOpacity: 0.8,
    type: "IMAGES",
    description: "Overlay images and textures",
  },
  regions: {
    id: "regions",
    name: "Regions",
    icon: "shapes",
    color: "#8b5cf6",
    defaultOpacity: 0.3,
    type: "REGIONS",
    description: "Territory boundaries and areas",
  },
  custom: {
    id: "custom",
    name: "Custom Layer",
    icon: "layers",
    color: "#3b82f6",
    defaultOpacity: 1,
    type: "CUSTOM",
    description: "Mixed content layer",
  },
};
