/**
 * Floating UI components for the world editor
 *
 * These modules provide spatial context and global tools.
 * Contextual features (layers, properties, comments, versions)
 * are now in the docks/sidebars.
 */
export { FloatingPanel } from "./floating-panel";
export { LoreModule } from "./lore-module";
export { GalleryModule } from "./gallery-module";
export { CharactersModule } from "./characters-module";
export { FiltersModule } from "./filters-module";
export { MembersModule } from "./members-module";
export { ActivityModule } from "./activity-module";
export { ImportModule } from "./import-module";

// Re-export types
export type { FloatingPanelProps } from "./floating-panel";
