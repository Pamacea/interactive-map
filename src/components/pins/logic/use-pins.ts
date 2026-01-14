"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPin, updatePin, deletePin, getPinsByWorld } from "@/actions/pins";
import { CACHE_TIMES } from "@/components/providers/query-provider";
import type {
  Pin,
  PinCreateInput,
  PinUpdateInput,
  PinFilters,
} from "@/types/pin.type";
import { PinTypeEnum } from "@/types/pin.type";

/**
 * Custom hook for pin management
 *
 * Integrates server state (TanStack Query) with UI state
 * Provides optimistic updates for better UX
 * Handles rollback on error
 *
 * @param worldId - The world ID to fetch pins for
 * @returns Pin data, mutations, and state
 */
export function usePins(worldId: string) {
  const queryClient = useQueryClient();

  // Query: Fetch pins for the world
  const {
    data: pins = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pins", worldId],
    queryFn: async () => {
      const result = await getPinsByWorld({
        gameWorldId: worldId,
        showVisibleOnly: false,
      });
      return result;
    },
    enabled: !!worldId,
    // Pins change frequently (users add/edit pins) - use shorter cache time
    staleTime: CACHE_TIMES.PINS, // 1 minute
    // Prevent duplicate fetches on mount/remount
    refetchOnMount: false,
    // Better UX: don't refetch when user returns to tab
    refetchOnWindowFocus: false,
    // Don't refetch automatically on reconnect
    refetchOnReconnect: false,
  });

  // Mutation: Create pin with optimistic update
  const createMutation = useMutation({
    mutationFn: (data: PinCreateInput) => createPin(data),

    onMutate: async (newPin) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["pins", worldId] });

      // Snapshot previous value
      const previousPins = queryClient.getQueryData<Pin[]>(["pins", worldId]);

      // Optimistically update to the new value
      const optimisticPin: Pin = {
        id: `optimistic-${Date.now()}`,
        title: newPin.title,
        description: newPin.description || null,
        pinType: newPin.pinType || PinTypeEnum.CUSTOM,
        latitude: newPin.latitude,
        longitude: newPin.longitude,
        icon: newPin.icon || null,
        color: newPin.color || "#3b82f6",
        size: newPin.size || 32,
        opacity: newPin.opacity || 1.0,
        isVisible: newPin.isVisible ?? true,
        minZoom: 0,
        maxZoom: 200,
        properties: newPin.properties || null,
        userId: "current-user",
        gameWorldId: newPin.gameWorldId,
        layerId: newPin.layerId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      queryClient.setQueryData<Pin[]>(["pins", worldId], (old = []) => {
        const updated = [optimisticPin, ...old];
        return updated;
      });

      // Return context with previous value and optimistic pin
      return { previousPins, optimisticPin };
    },

    onError: (err, newPin, context) => {
      console.error("[use-pins] Mutation failed:", err);
      // Rollback to previous value on error
      if (context?.previousPins) {
        queryClient.setQueryData(["pins", worldId], context.previousPins);
      }
    },

    onSuccess: (result, variables, context) => {
      // Replace optimistic pin with real server data
      if (context?.optimisticPin && result.pin) {
        queryClient.setQueryData<Pin[]>(["pins", worldId], (old = []) => {
          const updated = old.map((pin) =>
            pin.id === context.optimisticPin.id ? (result.pin as Pin) : pin
          );
          return updated;
        });
      }
    },

    // Note: No onSettled refetch needed since onSuccess handles cache update
    // Optimistic update + onSuccess replacement keeps cache in sync without refetching
  });

  // Mutation: Update pin with optimistic update
  const updateMutation = useMutation({
    mutationFn: (data: PinUpdateInput) => updatePin(data),

    onMutate: async (updatedPin) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["pins", worldId] });

      // Snapshot previous value
      const previousPins = queryClient.getQueryData<Pin[]>(["pins", worldId]);

      // Optimistically update the pin
      queryClient.setQueryData<Pin[]>(["pins", worldId], (old = []) =>
        old.map((pin) =>
          pin.id === updatedPin.id
            ? { ...pin, ...updatedPin, updatedAt: new Date() }
            : pin
        )
      );

      // Return context with previous value
      return { previousPins };
    },

    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousPins) {
        queryClient.setQueryData(["pins", worldId], context.previousPins);
      }
    },

    // Note: No onSettled refetch needed - optimistic update is enough
    // If server update fails, onError will rollback
  });

  // Mutation: Delete pin with optimistic update
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePin(id),

    onMutate: async (deletedPinId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["pins", worldId] });

      // Snapshot previous value
      const previousPins = queryClient.getQueryData<Pin[]>(["pins", worldId]);

      // Optimistically remove the pin
      queryClient.setQueryData<Pin[]>(["pins", worldId], (old = []) =>
        old.filter((pin) => pin.id !== deletedPinId)
      );

      // Return context with previous value
      return { previousPins };
    },

    onError: (err, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousPins) {
        queryClient.setQueryData(["pins", worldId], context.previousPins);
      }
    },

    // Note: No onSettled refetch needed - optimistic update is enough
  });

  // Mutation: Select pin (UI state only, no server action)
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);

  const selectPin = (pinId: string | null) => {
    setSelectedPinId(pinId);
  };

  // Computed values
  const selectedPin =
    pins.find((pin) => pin.id === selectedPinId) || null;

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return {
    // Data
    pins,
    selectedPin,
    selectedPinId,

    // Loading states
    isLoading,
    isPending,
    error,

    // Mutations
    createPin: createMutation.mutate,
    updatePin: updateMutation.mutate,
    deletePin: deleteMutation.mutate,
    selectPin,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Error states
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  };
}

/**
 * Hook for filtered pins
 * Supports filtering by type, layer, visibility, and search term
 */
export function useFilteredPins(filters: PinFilters) {
  return useQuery({
    queryKey: ["pins", "filtered", filters],
    queryFn: () => getPinsByWorld(filters),
    enabled: !!filters.gameWorldId,
    // Pins change frequently (users add/edit pins)
    staleTime: CACHE_TIMES.PINS, // 1 minute
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
