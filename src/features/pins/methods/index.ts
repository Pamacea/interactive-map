/**
 * Methods Barrel Export
 *
 * Centralized exports for all pin-related Server Actions.
 * Import from here for clean imports:
 *   import { createPin, updatePin, deletePin } from "@/features/pins/methods"
 */

// CRUD operations
export { createPin } from "@/features/pins/actions/pins";
export { getPinById } from "@/features/pins/actions/pins";
export { getPinsByWorld } from "@/features/pins/actions/pins";
export { updatePin } from "@/features/pins/actions/pins";
export { deletePin } from "@/features/pins/actions/pins";

// Visibility and position updates
export { togglePinVisibility } from "@/features/pins/actions/pins";
export { updatePinPosition } from "@/features/pins/actions/pins";
export { batchUpdatePinPositions } from "@/features/pins/actions/pins";

// Icon management
export { uploadPinIcon } from "@/features/pins/actions/pins";
export { updatePinIconCustomization } from "@/features/pins/actions/pins";
export { uploadCustomPinIcon } from "@/features/pins/actions/pins";

// Type exports
export type { PinCreateInput } from "@/types/pin.type";
export type { PinUpdateInput } from "@/types/pin.type";
