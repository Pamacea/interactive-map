/**
 * Pin Shared Components Index
 *
 * Centralized exports for shared pin components and constants
 */

// Constants
export {
  ICON_SHAPES,
  getShapeClipPath,
  STANDARD_PRESET_COLORS,
  FANTASY_PRESET_COLORS,
  PRESET_COLORS,
  getFantasyColor,
  PIN_TYPE_OPTIONS,
  PIN_TYPE_ICONS,
  PIN_SIZE_LIMITS,
  COORDINATE_LIMITS,
  isValidNormalizedCoordinate,
  isValidGeographicCoordinate,
  ZOOM_LIMITS,
  HEX_COLOR_REGEX,
  isValidHexColor,
  normalizeHexColor,
  EMOJI_ICONS,
} from "./pin-constants";
export type { EmojiIconCategory } from "./pin-constants";

// Types
export type { PinColorPickerProps } from "./pin-color-picker";
export type { PinShapeSelectorProps } from "./pin-shape-selector";
export type { PinCoordinateInputProps } from "./pin-coordinate-input";
export type { PinTypeBadgeProps } from "./pin-type-badge";
export type { InlineEditTextProps } from "./inline-edit-text";

// Components
export { PinColorPicker } from "./pin-color-picker";
export { PinShapeSelector } from "./pin-shape-selector";
export { PinCoordinateInput } from "./pin-coordinate-input";
export { PinTypeBadge } from "./pin-type-badge";
export { InlineEditText } from "./inline-edit-text";
