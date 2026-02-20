/**
 * World logic hooks barrel export
 */

// Editor interactions (Phase 1: Quick Wins)
export { useEditorInteractions } from "./use-editor-interactions";
export { useKeyboardShortcuts as useWorldKeyboardShortcuts } from "./use-world-keyboard";
export type { KeyboardShortcutConfig } from "./use-world-keyboard";
export type { EditorInteractionsConfig } from "./use-editor-interactions";

// Tools system
export { useToolCursor, useToolCursorValue } from "./use-tool-cursor";
export { useToolsIntegration, useToolCursorClass, useToolActiveCursorClass } from "./use-tools-integration";
export type { UseToolsIntegrationOptions, UseToolsIntegrationReturn } from "./use-tools-integration";

// Tools manager
export { useToolsManager } from "./tools/use-tools-manager";
export type { UseToolsManagerOptions, ToolsManagerHandlers } from "./tools/use-tools-manager";

// Existing hooks
export { useAutosavePreparation } from "./use-autosave-preparation";
export { useFloatingPanel } from "./use-floating-panel";
export { useLayersPanel } from "./use-layers-panel";
export { useLeftDock } from "./use-left-dock";
export { useMapEvents } from "./use-map-events";
export { useMapHandlers } from "./use-map-handlers";
export { useMapImage } from "./use-map-image";
export { useMapInitialization } from "./use-map-initialization";
export { useMapInteractions } from "./use-map-interactions";
export { useMapPan } from "./use-map-pan";
export { useMapWheel } from "./use-map-wheel";
export { useMapZoom } from "./use-map-zoom";
export { usePanelDock } from "./use-panel-dock";
export { usePinFilters } from "./use-pin-filters";
export { usePinsFiltering } from "./use-pins-filtering";
export { usePinPropertiesForm } from "./use-pin-properties-form";
export { usePropertiesPanel } from "./use-properties-panel";
export { useResizableSidebar } from "./use-resizable-sidebar";
export { useResizableDock } from "./use-resizable-dock";
export { useWorldInitialization } from "./use-world-initialization";
export { useWorldSidebar } from "./use-world-sidebar";
