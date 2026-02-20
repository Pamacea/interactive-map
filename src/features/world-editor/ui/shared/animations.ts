/**
 * Animation Constants and Utilities
 *
 * Provides consistent animation timings, easing functions, and CSS classes
 * for smooth 60fps animations across the world map interface.
 *
 * All animations use CSS transforms and opacity to ensure GPU acceleration.
 */

// ============== Duration Classes ==============

/**
 * Pre-defined duration classes following Tailwind conventions
 * All use ease-out for snappy, responsive feel
 */
export const ANIMATIONS = {
  /** 150ms - Quick feedback (hover, button press) */
  fast: "duration-150 ease-out",
  /** 200ms - Standard interaction (panel toggle, selection) */
  normal: "duration-200 ease-out",
  /** 300ms - Smooth transition (panel slide-in, modal) */
  slow: "duration-300 ease-in-out",
  /** 400ms - Deliberate transition (toast, overlay) */
  slower: "duration-400 ease-in-out",
  /** 500ms - Emphasized transition (page load, major state change) */
  slowest: "duration-500 ease-in-out",
} as const;

// ============== Transition Presets ==============

/**
 * Pre-combined transition classes for common use cases
 */
export const TRANSITIONS = {
  /** Hover effects on buttons and interactive elements */
  hover: "transition-transform duration-150 ease-out",
  /** Panel opening/closing with size and position changes */
  panel: "transition-all duration-300 ease-in-out",
  /** Selection state changes (cards, list items) */
  selection: "transition-all duration-200 ease-out",
  /** Toast notifications and floating elements */
  toast: "transition-all duration-400 ease-in-out",
  /** Fade transitions for content replacement */
  fade: "transition-opacity duration-200 ease-out",
  /** Transform transitions for position/scale changes */
  transform: "transition-transform duration-200 ease-out",
  /** Color transitions (border, background) */
  color: "transition-colors duration-150 ease-out",
  /** Shadow transitions for depth changes */
  shadow: "transition-shadow duration-200 ease-out",
} as const;

// ============== Animation Classes ==============

/**
 * CSS animation classes using Tailwind's animate-in utilities
 * These provide enter animations for elements appearing on screen
 */
export const animationClasses = {
  /** Fade in from invisible */
  fadeIn: "animate-in fade-in duration-300",
  /** Slide in from bottom of viewport */
  slideIn: "animate-in slide-in-from-bottom duration-300",
  /** Slide in from top (dropdowns) */
  slideInFromTop: "animate-in slide-in-from-top duration-200",
  /** Slide in from left (sidebar) */
  slideInFromLeft: "animate-in slide-in-from-left duration-300",
  /** Slide in from right (panels) */
  slideInFromRight: "animate-in slide-in-from-right duration-300",
  /** Scale up from smaller size */
  scaleIn: "animate-in zoom-in duration-200",
  /** Scale down from larger size */
  scaleOut: "animate-in zoom-out duration-200",
  /** Continuous pulse animation */
  pulse: "animate-pulse",
  /** Continuous bounce animation */
  bounce: "animate-bounce",
  /** Spin animation (loading indicators) */
  spin: "animate-spin",
  /** Ping animation (notifications) */
  ping: "animate-ping",
} as const;

// ============== Exit Animation Classes ==============

/**
 * Exit animations for elements leaving the screen
 * Uses Tailwind's animate-out utilities
 */
export const exitAnimationClasses = {
  /** Fade out to invisible */
  fadeOut: "animate-out fade-out duration-200",
  /** Slide out to bottom */
  slideOut: "animate-out slide-out-to-bottom duration-200",
  /** Slide out to top */
  slideOutToTop: "animate-out slide-out-to-top duration-200",
  /** Slide out to left */
  slideOutToLeft: "animate-out slide-out-to-left duration-200",
  /** Slide out to right */
  slideOutToRight: "animate-out slide-out-to-right duration-200",
  /** Scale down to nothing */
  scaleOut: "animate-out zoom-out duration-150",
} as const;

// ============== Spring Animations ==============

/**
 * Spring-like animation classes using custom cubic-bezier
 * Provides bouncy, natural motion for playful interactions
 */
export const springAnimations = {
  /** Gentle bounce for small interactions */
  gentle: "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  /** Medium bounce for emphasis */
  medium: "transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  /** Strong bounce for major interactions */
  strong: "transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
} as const;

// ============== Easing Functions ==============

/**
 * Raw easing values for custom animations
 * Use with CSS custom properties or inline styles
 */
export const easings = {
  /** Standard ease-out - fast start, slow end */
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  /** Ease-in-out - smooth start and end */
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Ease-in - slow start, fast end */
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  /** Spring - bouncy overshoot */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Sharp - snappy, minimal curve */
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

// ============== Animation Utilities ==============

/**
 * Helper function to create a custom transition string
 * @param properties - CSS properties to animate
 * @param duration - Duration in ms
 * @param easing - Easing function name
 */
export function createTransition(
  properties: string[],
  duration: number,
  easing: keyof typeof easings = "easeOut"
): string {
  const easingValue = easings[easing];
  return properties
    .map((prop) => `${prop} ${duration}ms ${easingValue}`)
    .join(", ");
}

/**
 * Check if the user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation duration respecting reduced motion preference
 * @param duration - Duration in ms
 */
export function getRespectfulDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

/**
 * Transition variant for components that support animation
 */
export type TransitionVariant =
  | "none"
  | "fast"
  | "normal"
  | "slow"
  | "slower"
  | "spring";

/**
 * Get transition classes for a variant
 * @param variant - Animation variant
 */
export function getTransitionClasses(variant: TransitionVariant): string {
  switch (variant) {
    case "none":
      return "";
    case "fast":
      return TRANSITIONS.hover;
    case "normal":
      return TRANSITIONS.selection;
    case "slow":
      return TRANSITIONS.panel;
    case "slower":
      return TRANSITIONS.toast;
    case "spring":
      return springAnimations.gentle;
    default:
      return TRANSITIONS.selection;
  }
}

// ============== Performance ==============

/**
 * CSS properties that are GPU-accelerated
 * Use these for smooth animations
 */
export const gpuAcceleratedProps = [
  "transform",
  "opacity",
  "filter",
  "perspective",
] as const;

/**
 * Properties that trigger layout recalculations
 * Avoid animating these for smooth 60fps
 */
export const layoutTriggeringProps = [
  "width",
  "height",
  "top",
  "left",
  "right",
  "bottom",
  "margin",
  "padding",
  "border-width",
] as const;

/**
 * Check if a property is safe to animate (GPU-accelerated)
 * @param prop - CSS property name
 */
export function isSafeToAnimate(prop: string): boolean {
  return gpuAcceleratedProps.some((safe) => prop.startsWith(safe));
}

// ============== CSS Custom Properties ==============

/**
 * CSS custom property names for animation values
 * Define these in your global CSS or component styles
 */
export const cssVars = {
  durationFast: "--animation-duration-fast",
  durationNormal: "--animation-duration-normal",
  durationSlow: "--animation-duration-slow",
  easingOut: "--animation-easing-out",
  easingSpring: "--animation-easing-spring",
} as const;

/**
 * Default values for CSS custom properties
 * Use in global styles or component root
 */
export const cssVarDefaults = {
  [cssVars.durationFast]: "150ms",
  [cssVars.durationNormal]: "200ms",
  [cssVars.durationSlow]: "300ms",
  [cssVars.easingOut]: easings.easeOut,
  [cssVars.easingSpring]: easings.spring,
} as const;
