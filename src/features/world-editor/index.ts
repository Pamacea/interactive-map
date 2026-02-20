/**
 * World Components Barrel Export
 *
 * Centralized exports for all world/editor components.
 * Import from here for clean imports:
 *   import { WorldClient, LayersPanel } from "@/features/world-editor"
 */

// === Main World Components ===
export { WorldClient } from "./ui/world-client"
export { WorldHeader } from "./ui/world-header"
export { WorldNavigation } from "./ui/world-navigation"
export { WorldSkeleton } from "./ui/world-skeleton"

// === Map Components ===
export { MapCanvas } from "./ui/map-canvas"
export { MapContainer } from "./ui/map-canvas/map-container"
export { MapContent } from "./ui/map-canvas/map-content"
export { MapOverlays } from "./ui/map-canvas/map-overlays"
export { MapPinsWrapper } from "./ui/map-canvas/map-pins-wrapper"
export { MapTransformLayer } from "./ui/map-canvas/map-transform-layer"
export { MapImage } from "./ui/map-image"
export { MapLayers } from "./ui/map-layers"
export { MapLayersIndicator } from "./ui/map-layers-indicator"
export { MapPlaceholder } from "./ui/map-placeholder"
export { MapSkeleton } from "./ui/map-skeleton"
export { MapPropertiesSection } from "./ui/map-properties-section"
export { PinsRenderer } from "./ui/pins-renderer"
export { RegionsRenderer } from "./ui/regions-renderer"
export { PresenceCursors } from "./ui/presence-cursors"
export { ResizeHandle } from "./ui/resize-handle"

// === Panels & Docks ===
export { LayersPanel } from "./ui/layers-panel"
export { PropertiesPanel } from "./ui/properties-panel"
export { PinsFilterPanel } from "./ui/pins-filter-panel"

// Re-export from subdirectories with existing barrel exports
export * from "./ui/bars"
export * from "./ui/docks"
export * from "./ui/floating"
export * from "./ui/layers"
export * from "./ui/panel"
export * from "./ui/pin-properties"
export * from "./ui/shared"
export * from "./ui/tools"

// === Dialog Components ===
export { AddLayerDialog } from "./ui/add-layer-dialog"
export { IconUploadDialog } from "./ui/icon-upload-dialog"
export { UploadMapDialog } from "./ui/upload-map-dialog"

// === Property Forms ===
export { PinPropertiesSection } from "./ui/pin-properties-section"

// === UI Components ===
export { AutosaveIndicator } from "./ui/autosave-indicator"
export { LayerItem } from "./ui/layer-item"
export { SelectedPinPopup } from "./ui/selected-pin-popup"
export { PlacementIndicator } from "./ui/placement-indicator"
export { ZoomControls } from "./ui/zoom-controls"
export { MeasureControls } from "./ui/measure-controls"
export { PinProperties } from "./ui/pin-properties"

// === Context ===
export { MapProvider, useMapContext } from "./context/map-context"

// === Logic/Hooks (Re-export from existing barrel) ===
export * from "./logic"

// === Actions (Re-export from existing barrel) ===
export * from "./actions"
