/**
 * Input Manager Barrel Export
 *
 * Unified input management system for the application.
 * Centralizes all user input handling with proper priority and propagation control.
 */

export {
  inputManager,
  useInputManager,
  useDrag,
  useKeyboard,
  INPUT_PRIORITY,
} from "./input-manager";

export type {
  InputElement,
  InputMode,
  MouseButton,
  PointerState,
  DragState,
  KeyboardState,
  InputManagerCallbacks,
  UseInputManagerOptions,
  UseDragOptions,
  UseKeyboardOptions,
} from "./input-manager";
