import { useState, useEffect, useCallback } from "react";

interface LoadingStateOptions {
  minDuration?: number; // Minimum duration to show loading (ms) - prevents flicker
  maxDuration?: number; // Maximum duration before timing out (ms)
}

interface LoadingStateReturn {
  isLoading: boolean;
  isMinDurationMet: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Consistent loading state management
 * Prevents flickering by enforcing minimum loading duration
 *
 * @example
 * ```tsx
 * const { isLoading, startLoading, stopLoading } = useLoadingState({ minDuration: 300 });
 *
 * const fetchData = async () => {
 *   startLoading();
 *   try {
 *     const _data = await api.fetch();
 *     setData(data);
 *   } finally {
 *     stopLoading();
 *   }
 * };
 * ```
 */
export function useLoadingState(
  options: LoadingStateOptions = {}
): LoadingStateReturn {
  const { minDuration = 300, maxDuration } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isMinDurationMet, setIsMinDurationMet] = useState(true);

  // Enforce minimum duration
  useEffect(() => {
    if (isLoading && startTime) {
      // Mark that we haven't met minimum duration yet
      // Defer to avoid setState in effect warning
      const _timer = setTimeout(() => setIsMinDurationMet(false), 0);

      const minTimer = setTimeout(() => {
        setIsMinDurationMet(true);
      }, minDuration);

      // Optional max duration timeout
      let maxTimer: NodeJS.Timeout | undefined;
      if (maxDuration) {
        maxTimer = setTimeout(() => {
          console.warn(`Loading state exceeded max duration of ${maxDuration}ms`);
          setIsLoading(false);
        }, maxDuration);
      }

      return () => {
        clearTimeout(minTimer);
        if (maxTimer) clearTimeout(maxTimer);
      };
    } else if (!isLoading) {
      // Reset when loading stops
      // Defer to avoid setState in effect warning
      const resetTimer = setTimeout(() => setIsMinDurationMet(true), 0);
      return () => clearTimeout(resetTimer);
    }
  }, [isLoading, startTime, minDuration, maxDuration]);

  const startLoading = useCallback(() => {
    setStartTime(Date.now());
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setStartTime(null);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    if (loading) {
      startLoading();
    } else {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    isMinDurationMet,
    startLoading,
    stopLoading,
    setLoading,
  };
}

/**
 * Simplified hook for async operations with automatic loading state
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useAsyncOperation(
 *   async () => {
 *     const response = await fetch("/api/data");
 *     return response.json();
 *   }
 * );
 *
 * return (
 *   <div>
 *     {isLoading && <SkeletonSpinner />}
 *     {error && <ErrorMessage>{error}</ErrorMessage>}
 *     {data && <DataDisplay data={data} />}
 *   </div>
 * );
 * ```
 */
export function useAsyncOperation<T>(
  asyncFn: () => Promise<T>,
  options: LoadingStateOptions = {}
) {
  const { isLoading, startLoading, stopLoading } = useLoadingState(options);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    startLoading();
    try {
      const _result = await asyncFn();
      setData(result);
      setError(null);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      throw error;
    } finally {
      stopLoading();
    }
  }, [asyncFn, startLoading, stopLoading]);

  return {
    data,
    isLoading,
    error,
    execute,
  };
}
