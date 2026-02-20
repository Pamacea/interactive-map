/**
 * Toast Notifications - Enhanced feedback system with queue management
 *
 * Features:
 * - Toast queue (max 3 visible at once)
 * - Auto-dismiss after 3000ms
 * - Manual dismiss with click
 * - Progress bar indicator
 * - Multiple types: success, error, info, warning
 *
 * Usage:
 * ```tsx
 * import { useToastQueue } from "./toast-notifications";
 *
 * function Component() {
 *   const { showToast } = useToastQueue();
 *
 *   const handleSave = () => {
 *     showToast("Pin created successfully", "success");
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */

"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Check, X, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/utils";

// ============================================================================
// TYPES
// ============================================================================

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  timestamp: number;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_DURATION = 3000;
const MAX_VISIBLE_TOASTS = 3;

// Toast styling configuration
const TOAST_CONFIG = {
  success: {
    bg: "bg-emerald-950/90",
    border: "border-emerald-700/50",
    text: "text-emerald-100",
    icon: Check,
    iconColor: "text-emerald-400",
  },
  error: {
    bg: "bg-rose-950/90",
    border: "border-rose-700/50",
    text: "text-rose-100",
    icon: AlertCircle,
    iconColor: "text-rose-400",
  },
  info: {
    bg: "bg-blue-950/90",
    border: "border-blue-700/50",
    text: "text-blue-100",
    icon: Info,
    iconColor: "text-blue-400",
  },
  warning: {
    bg: "bg-amber-950/90",
    border: "border-amber-700/50",
    text: "text-amber-100",
    icon: AlertTriangle,
    iconColor: "text-amber-400",
  },
};

// ============================================================================
// INDIVIDUAL TOAST COMPONENT
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const config = TOAST_CONFIG[toast.type];
  const Icon = config.icon;
  const [progress, setProgress] = useState(100);

  const duration = toast.duration ?? DEFAULT_DURATION;

  // Animate progress bar
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const percentage = (remaining / duration) * 100;
      setProgress(percentage);

      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animationId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [duration]);

  // Auto-remove after duration
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onRemove(toast.id);
    }, duration);

    return () => clearTimeout(timeoutId);
  }, [toast.id, duration, onRemove]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 rounded-sm border shadow-lg backdrop-blur-sm",
        "min-w-80 max-w-md transition-all duration-300",
        "animate-in slide-in-from-right fade-in duration-200",
        config.bg,
        config.border
      )}
    >
      {/* Icon */}
      <Icon className={cn("w-5 h-5 flex-shrink-0", config.iconColor)} />

      {/* Message */}
      <p className={cn("flex-1 text-sm leading-relaxed", config.text)}>
        {toast.message}
      </p>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          "flex-shrink-0 p-0.5 rounded transition-colors",
          "hover:bg-black/10",
          config.text
        )}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/20 overflow-hidden">
        <div
          className={cn("h-full transition-all ease-linear", {
            "bg-emerald-400": toast.type === "success",
            "bg-rose-400": toast.type === "error",
            "bg-blue-400": toast.type === "info",
            "bg-amber-400": toast.type === "warning",
          })}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// TOAST CONTAINER
// ============================================================================

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useToastQueue() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToastQueue must be used within ToastQueueProvider");
  }

  return context;
}

// ============================================================================
// PROVIDER
// ============================================================================

interface ToastQueueProviderProps {
  children: ReactNode;
}

export function ToastQueueProvider({ children }: ToastQueueProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((
    message: string,
    type: ToastType = "info",
    duration?: number
  ) => {
    const newToast: Toast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
      duration,
    };

    setToasts((prev) => {
      const updated = [newToast, ...prev];
      // Keep only MAX_VISIBLE_TOASTS most recent
      return updated.slice(0, MAX_VISIBLE_TOASTS);
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast, clearAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

// ============================================================================
// CONVENIENCE HOOKS FOR SPECIFIC TOAST TYPES
// ============================================================================

export function useToasts() {
  const { showToast, removeToast, clearAll } = useToastQueue();

  return {
    showSuccess: (message: string, duration?: number) =>
      showToast(message, "success", duration),
    showError: (message: string, duration?: number) =>
      showToast(message, "error", duration),
    showInfo: (message: string, duration?: number) =>
      showToast(message, "info", duration),
    showWarning: (message: string, duration?: number) =>
      showToast(message, "warning", duration),
    removeToast,
    clearAll,
  };
}
