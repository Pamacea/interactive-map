"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/components/providers/query-provider";
import {
  getGalleryItemsByWorld,
  uploadGalleryImage,
  deleteGalleryItem as deleteGalleryItemAction,
  updateGalleryItem as updateGalleryItemAction,
} from "@/actions/gallery";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

/**
 * Query keys for gallery operations
 */
export const galleryKeys = {
  all: ["gallery"] as const,
  worlds: () => [...galleryKeys.all, "worlds"] as const,
  world: (worldId: string) => [...galleryKeys.worlds(), worldId] as const,
  pins: (pinId: string) => [...galleryKeys.all, "pin", pinId] as const,
  lore: (loreId: string) => [...galleryKeys.all, "lore", loreId] as const,
};

/**
 * Hook to fetch gallery items for a world
 * Uses TanStack Query for caching and automatic refetching
 */
export function useGallery(worldId: string) {
  return useQuery<GalleryItemWithRelations[]>({
    queryKey: galleryKeys.world(worldId),
    queryFn: () => getGalleryItemsByWorld(worldId),
    staleTime: CACHE_TIMES.WORLD,
    enabled: !!worldId,
  });
}

/**
 * Hook to fetch gallery items for a specific pin
 */
export function usePinGallery(pinId: string) {
  return useQuery<GalleryItemWithRelations[]>({
    queryKey: galleryKeys.pins(pinId),
    queryFn: () => getGalleryItemsByWorld(pinId),
    enabled: !!pinId,
  });
}

/**
 * Hook to fetch gallery items for a specific lore entry
 */
export function useLoreGallery(loreId: string) {
  return useQuery<GalleryItemWithRelations[]>({
    queryKey: galleryKeys.lore(loreId),
    queryFn: () => getGalleryItemsByWorld(loreId),
    enabled: !!loreId,
  });
}

/**
 * Hook for uploading gallery images
 * Invalidates gallery queries on success
 */
export function useUploadGallery() {
  const _queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadGalleryImage,
    onSuccess: (result) => {
      // Get worldId from the result data
      const _worldId = result.data?.galleryItem?.pin?.gameWorldId ??
        result.data?.galleryItem?.loreEntry?.gameWorldId;

      if (worldId) {
        queryClient.invalidateQueries({ queryKey: galleryKeys.world(worldId) });
      }
    },
  });
}

/**
 * Hook for deleting gallery items
 * Invalidates gallery queries on success
 */
export function useDeleteGallery() {
  const _queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGalleryItemAction,
    onSuccess: () => {
      // Invalidate all gallery queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}

/**
 * Hook for updating gallery items
 * Invalidates gallery queries on success
 */
export function useUpdateGallery() {
  const _queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGalleryItemAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.all });
    },
  });
}
