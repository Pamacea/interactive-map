"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Query cache configuration constants
 *
 * Stale times are based on data change frequency:
 * - World metadata: rarely changes (5 minutes)
 * - Layers: moderate changes (2 minutes)
 * - Pins: frequent user edits (1 minute)
 */
export const CACHE_TIMES = {
  WORLD: 1000 * 60 * 5, // 5 minutes
  LAYERS: 1000 * 60 * 2, // 2 minutes
  PINS: 1000 * 60 * 1, // 1 minute
} as const;

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const _queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // 5 minutes default for rarely-changing data (world metadata)
        staleTime: CACHE_TIMES.WORLD,
        // Better UX: don't refetch when user returns to tab
        refetchOnWindowFocus: false,
        // Prevent duplicate fetches when component remounts
        refetchOnMount: false,
        // Don't refetch automatically on reconnect
        refetchOnReconnect: false,
        // Retry failed requests once
        retry: 1,
      },
    },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
