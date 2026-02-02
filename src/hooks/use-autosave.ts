import { useEffect, useRef, useState, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export type AutosaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

export interface AutosaveOptions {
  delay?: number; // Default 3000ms
  enabled?: boolean;
  isAuthenticated?: boolean; // Pass auth state from server component
  onError?: (error: Error) => void;
}

export function useAutosave<T>(
  key: string,
  data: T,
  saveFn: (data: T) => Promise<void>,
  options: AutosaveOptions = {}
) {
  const { delay = 3000, enabled = true, isAuthenticated = true, onError } = options;

  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const lastSavedData = useRef<T>(data);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced data value
  const debouncedData = useDebounce(data, delay);

  // Compare data to detect real changes
  const hasDataChanged = useCallback(
    (currentData: T, savedData: T): boolean => {
      return JSON.stringify(currentData) !== JSON.stringify(savedData);
    },
    []
  );

  // Clear any pending save timeout
  const clearSaveTimeout = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
  }, []);

  // Manual save function
  const saveNow = useCallback(async () => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    clearSaveTimeout();

    if (!hasDataChanged(data, lastSavedData.current)) {
      return;
    }

    setStatus("saving");

    try {
      await saveFn(data);
      lastSavedData.current = data;
      setStatus("saved");

      // Reset to "idle" or "unsaved" after 2 seconds
      setTimeout(() => {
        setStatus((prev) => (prev === "saved" ? "idle" : prev));
      }, 2000);
    } catch (error) {
      console.error("[useAutosave] Save failed for:", key, error);
      setStatus("error");
      onError?.(error as Error);
    }
  }, [data, enabled, isAuthenticated, saveFn, key, hasDataChanged, clearSaveTimeout, onError]);

  // Auto-save on debounced data change
  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      return;
    }

    // Skip if data hasn't changed
    if (!hasDataChanged(debouncedData, lastSavedData.current)) {
      return;
    }

    // Mark as unsaved - defer to avoid setState in effect
    const markUnsavedTimer = setTimeout(() => setStatus("unsaved"), 0);

    // Clear any existing timeout
    clearSaveTimeout();

    // Schedule save after delay
    saveTimeoutRef.current = setTimeout(async () => {
      setStatus("saving");

      try {
        await saveFn(debouncedData);
        lastSavedData.current = debouncedData;
        setStatus("saved");

        // Reset to "idle" after 2 seconds
        setTimeout(() => {
          setStatus((prev) => (prev === "saved" ? "idle" : prev));
        }, 2000);
      } catch (error) {
        console.error("[useAutosave] Autosave failed for:", key, error);
        setStatus("error");
        onError?.(error as Error);
      }
    }, delay);

    // Cleanup timeout on unmount or when data changes again
    return () => {
      clearSaveTimeout();
    };
  }, [
    debouncedData,
    enabled,
    isAuthenticated,
    saveFn,
    key,
    delay,
    hasDataChanged,
    clearSaveTimeout,
    onError,
  ]);

  // Update last saved data when initial data loads
  useEffect(() => {
    if (status === "idle") {
      lastSavedData.current = data;
    }
  }, [data, status]);

  return {
    status,
    saveNow,
    isAuthenticated,
    hasUnsavedChanges: status === "unsaved",
  };
}
