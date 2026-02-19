/**
 * Loading State Management for API calls
 *
 * Provides hooks and utilities to track loading states for API operations.
 * Integrates with TanStack Query for automatic loading state tracking.
 *
 * Usage:
 *   const { isLoading, startLoading, stopLoading } = useApiLoading();
 *   const { isLoading: isPinsLoading } = useQueryLoading(['pins']);
 */

import { useCallback, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// ============== Types ==============

interface LoadingState {
  isLoading: boolean;
  progress: number; // 0-100 for progress indication
  message?: string;
}

interface LoadingStates {
  [key: string]: LoadingState;
}

// ============== Store ==============

// Global loading states store
const loadingStates: LoadingStates = {};
const loadingListeners = new Set<() => void>();

function notifyListeners() {
  loadingListeners.forEach((listener) => listener());
}

function setLoadingState(key: string, state: Partial<LoadingState>) {
  loadingStates[key] = {
    ...loadingStates[key],
    ...state,
  };
  notifyListeners();
}

function clearLoadingState(key: string) {
  delete loadingStates[key];
  notifyListeners();
}

function getLoadingState(key: string): LoadingState {
  return loadingStates[key] || { isLoading: false, progress: 0 };
}

function isAnyLoading(): boolean {
  return Object.values(loadingStates).some((state) => state.isLoading);
}

function getLoadingKeys(): string[] {
  return Object.keys(loadingStates).filter((key) => loadingStates[key]?.isLoading);
}

// ============== Hooks ==============

/**
 * Hook to manage loading state for a specific operation
 *
 * @param key - Unique identifier for the loading operation
 * @returns Loading state and control functions
 */
export function useApiLoading(key?: string) {
  const [localLoading, setLocalLoading] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const [localMessage, setLocalMessage] = useState<string | undefined>();

  // Subscribe to global loading changes
  useEffect(() => {
    if (!key) return;

    const updateFromGlobal = () => {
      const state = getLoadingState(key);
      setLocalLoading(state.isLoading);
      setLocalProgress(state.progress);
      setLocalMessage(state.message);
    };

    updateFromGlobal();
    loadingListeners.add(updateFromGlobal);

    return () => {
      loadingListeners.delete(updateFromGlobal);
    };
  }, [key]);

  const startLoading = useCallback((message?: string) => {
    if (key) {
      setLoadingState(key, { isLoading: true, progress: 0, message });
    } else {
      setLocalLoading(true);
      setLocalProgress(0);
      setLocalMessage(message);
    }
  }, [key]);

  const stopLoading = useCallback(() => {
    if (key) {
      clearLoadingState(key);
    } else {
      setLocalLoading(false);
      setLocalMessage(undefined);
    }
  }, [key]);

  const setProgress = useCallback((progress: number) => {
    if (key) {
      setLoadingState(key, { progress });
    } else {
      setLocalProgress(progress);
    }
  }, [key]);

  const setMessage = useCallback((message: string) => {
    if (key) {
      setLoadingState(key, { message });
    } else {
      setLocalMessage(message);
    }
  }, [key]);

  return {
    isLoading: key ? localLoading : false,
    progress: localProgress,
    message: localMessage,
    startLoading,
    stopLoading,
    setProgress,
    setMessage,
  };
}

/**
 * Hook to check if any API operation is currently loading
 */
export function useGlobalLoading(): boolean {
  const [isAnyLoadingState, setIsAnyLoadingState] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsAnyLoadingState(isAnyLoading());
    };

    update();
    loadingListeners.add(update);

    return () => {
      loadingListeners.delete(update);
    };
  }, []);

  return isAnyLoadingState;
}

/**
 * Hook to get all currently loading operations
 */
export function useLoadingOperations(): string[] {
  const [loadingKeys, setLoadingKeys] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      setLoadingKeys(getLoadingKeys());
    };

    update();
    loadingListeners.add(update);

    return () => {
      loadingListeners.delete(update);
    };
  }, []);

  return loadingKeys;
}

/**
 * Hook to get loading state for a specific TanStack Query key
 *
 * @param queryKey - The TanStack Query key to track
 * @returns Loading state for the query
 */
export function useQueryLoading<TQueryKey extends readonly unknown[]>(
  queryKey: TQueryKey
): { isLoading: boolean; isRefetching: boolean } {
  const queryClient = useQueryClient();
  const [state, setState] = useState({ isLoading: false, isRefetching: false });

  // Check query state periodically (could be optimized with QueryCache订阅)
  useEffect(() => {
    const checkState = () => {
      const queryState = queryClient.getQueryState(queryKey);
      setState({
        isLoading: queryState?.status === "pending",
        isRefetching: queryState?.fetchStatus === "fetching" && queryState?.status !== "pending",
      });
    };

    // Initial check
    checkState();

    // Set up interval to check state (in case query changes externally)
    const interval = setInterval(checkState, 100);

    // Also check on query cache changes
    const unsubscribe = queryClient.getQueryCache().subscribe({
      callback: (event) => {
        if (
          event.type === "updated" &&
          event.query.queryKey === queryKey
        ) {
          checkState();
        }
      },
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [queryClient, queryKey]);

  return state;
}

/**
 * Hook to wrap async operations with automatic loading state
 *
 * @param key - Optional key for global loading tracking
 * @returns Function to wrap async operations
 */
export function useLoadingWrapper(key?: string) {
  const loadingState = useApiLoading(key);

  const wrap = useCallback(
    async <T,>(operation: () => Promise<T>, message?: string): Promise<T> => {
      try {
        loadingState.startLoading(message);
        const result = await operation();
        return result;
      } finally {
        loadingState.stopLoading();
      }
    },
    [loadingState]
  );

  return {
    ...loadingState,
    wrap,
  };
}

// ============== Utilities ==============

/**
 * Execute an async operation with loading state
 */
export async function withLoading<T>(
  key: string,
  operation: () => Promise<T>,
  message?: string
): Promise<T> {
  try {
    setLoadingState(key, { isLoading: true, progress: 0, message });
    return await operation();
  } finally {
    clearLoadingState(key);
  }
}

/**
 * Execute multiple operations with batch loading state
 */
export async function withBatchLoading<T>(
  key: string,
  operations: Array<() => Promise<T>>,
  message?: string
): Promise<T[]> {
  try {
    setLoadingState(key, { isLoading: true, progress: 0, message });
    const results: T[] = [];

    for (let i = 0; i < operations.length; i++) {
      const result = await operations[i]();
      results.push(result);
      setLoadingState(key, {
        progress: ((i + 1) / operations.length) * 100,
      });
    }

    return results;
  } finally {
    clearLoadingState(key);
  }
}

// ============== Exports ==============

export { getLoadingState, isAnyLoading, getLoadingKeys };
export type { LoadingState };
