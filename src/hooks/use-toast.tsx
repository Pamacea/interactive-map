import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";

export interface ToastState {
  message: string;
  type: "success" | "error";
}

interface ToastContextType {
  toast: ToastState | null;
  showToast: (message: string, type?: "success" | "error") => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(duration = 3000) {
  const context = useContext(ToastContext);

  // If used outside provider, create local state (backward compatibility)
  const [localToast, setLocalToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    if (context) {
      context.showToast(message, type);
      return;
    }

    // Local fallback
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLocalToast({ message, type });

    timeoutRef.current = setTimeout(() => {
      setLocalToast(null);
      timeoutRef.current = null;
    }, duration);
  }, [context, duration]);

  const hideToast = useCallback(() => {
    if (context) {
      context.hideToast();
      return;
    }

    // Local fallback
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setLocalToast(null);
  }, [context]);

  return {
    toast: context?.toast ?? localToast,
    showToast,
    hideToast,
  };
}

interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
}

export function ToastProvider({ children, duration = 3000 }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Show new toast
    setToast({ message, type });

    // Auto-hide after duration
    timeoutRef.current = setTimeout(() => {
      setToast(null);
      timeoutRef.current = null;
    }, duration);
  }, [duration]);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}

