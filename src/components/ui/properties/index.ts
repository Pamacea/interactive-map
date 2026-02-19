/**
 * Shared Property Components
 *
 * Reusable UI components for property panels across pins, layers, and worlds.
 * All components follow consistent styling and behavior patterns.
 */

export { PropertyInput, PropertyInputField } from "./property-input";
export type {
  PropertyInputProps,
  PropertyInputFieldProps,
  PropertyInputSize,
  PropertyInputVariant,
  PropertyInputState,
} from "./property-input";

export { PropertyTextarea } from "./property-textarea";
export type {
  PropertyTextareaProps,
  PropertyTextareaSize,
  PropertyTextareaVariant,
  PropertyTextareaMode,
} from "./property-textarea";

export { PropertyTitleInput, PropertyTitleField } from "./property-title-input";
export type { PropertyTitleInputProps, PropertyTitleFieldProps } from "./property-title-input";

export { PropertyDescriptionTextarea, PropertyDescriptionField } from "./property-description-textarea";
export type { PropertyDescriptionTextareaProps, PropertyDescriptionFieldProps } from "./property-description-textarea";

export { PropertyTagsInput, PropertyTagsField } from "./property-tags-input";
export type { PropertyTagsInputProps, PropertyTagsFieldProps, Tag } from "./property-tags-input";

export { PropertySelect } from "./property-select";
export type {
  PropertySelectProps,
  PropertySelectOption,
  PropertySelectOptionGroup,
} from "./property-select";

export {
  PropertyColorPicker,
  PRESET_COLORS,
} from "./property-color-picker";
export type { PropertyColorPickerProps } from "./property-color-picker";

export { PropertySlider, PropertySliderRange } from "./property-slider";
export type { PropertySliderProps, PropertySliderRangeProps } from "./property-slider";

export { PropertyToggle } from "./property-toggle";
export type { PropertyToggleProps } from "./property-toggle";

export { PropertyCoordinates } from "./property-coordinates";
export type { PropertyCoordinatesProps, Coordinates } from "./property-coordinates";

export { PropertyIconPicker, EMOJI_CATEGORIES } from "./property-icon-picker";
export type { PropertyIconPickerProps, EmojiCategory } from "./property-icon-picker";

export { PropertyImageUpload } from "./property-image-upload";
export type { PropertyImageUploadProps } from "./property-image-upload";
