import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { GalleryItemWithRelations, MediaType } from "@/types/gallery.type";
import {
  uploadGalleryImage,
  deleteGalleryItem as deleteGalleryItemAction,
  updateGalleryItem as updateGalleryItemAction,
} from "@/features/gallery/actions";

// UI State for gallery interactions
export interface GalleryUIState {
  selectedImageId: string | null;
  isUploading: boolean;
  isEditing: boolean;
  lightboxOpen: boolean;
  lightboxIndex: number;
}

// Filter state for gallery items
export interface GalleryFilters {
  searchTerm: string;
  type: MediaType | "ALL";
  linkedTo: "ALL" | "PINS" | "LORE" | "UNLINKED";
}

// Gallery data stored in client state (synced with server)
interface GalleryDataState {
  galleryItems: GalleryItemWithRelations[];
  filteredGalleryItems: GalleryItemWithRelations[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: Map<string, number>; // fileId -> progress percentage
}

interface GalleryStore extends GalleryUIState, GalleryFilters, GalleryDataState {
  // Selection actions
  selectImage: (imageId: string | null) => void;
  clearSelection: () => void;

  // Upload/editing actions
  startUploading: () => void;
  stopUploading: () => void;
  startEditing: () => void;
  stopEditing: () => void;

  // Lightbox actions
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  nextImage: () => void;
  previousImage: () => void;

  // Gallery CRUD operations (local state)
  setGalleryItems: (items: GalleryItemWithRelations[]) => void;
  addGalleryItem: (item: GalleryItemWithRelations) => void;
  updateGalleryItem: (itemId: string, updates: Partial<GalleryItemWithRelations>) => void;
  deleteGalleryItem: (itemId: string) => void;

  // Gallery CRUD operations (server sync with optimistic updates)
  uploadImage: (
    file: File,
    metadata: {
      title: string;
      description?: string;
      gameWorldId: string;
      pinId?: string;
      loreEntryId?: string;
    }
  ) => Promise<void>;
  deleteGalleryItemServer: (itemId: string) => Promise<void>;
  updateGalleryItemServer: (
    data: Parameters<typeof updateGalleryItemAction>[0]
  ) => Promise<void>;

  // Upload progress
  setUploadProgress: (fileId: string, progress: number) => void;
  removeUploadProgress: (fileId: string) => void;

  // Filter actions
  setSearchTerm: (term: string) => void;
  setTypeFilter: (type: MediaType | "ALL") => void;
  setLinkedToFilter: (filter: "ALL" | "PINS" | "LORE" | "UNLINKED") => void;
  resetFilters: () => void;
  applyFilters: () => void;

  // Loading and error state
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset all
  reset: () => void;
}

const initialState: GalleryUIState & GalleryFilters & GalleryDataState = {
  // UI State
  selectedImageId: null,
  isUploading: false,
  isEditing: false,
  lightboxOpen: false,
  lightboxIndex: 0,

  // Filters
  searchTerm: "",
  type: "ALL",
  linkedTo: "ALL",

  // Data
  galleryItems: [],
  filteredGalleryItems: [],
  isLoading: false,
  error: null,
  uploadProgress: new Map(),
};

export const useGalleryStore = create<GalleryStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Selection actions
      selectImage: (imageId) =>
        set({ selectedImageId: imageId }, false, "selectImage"),

      clearSelection: () =>
        set({ selectedImageId: null }, false, "clearSelection"),

      // Upload/editing actions
      startUploading: () =>
        set({ isUploading: true }, false, "startUploading"),

      stopUploading: () =>
        set({ isUploading: false }, false, "stopUploading"),

      startEditing: () =>
        set({ isEditing: true }, false, "startEditing"),

      stopEditing: () =>
        set({ isEditing: false }, false, "stopEditing"),

      // Lightbox actions
      openLightbox: (index) =>
        set(
          {
            lightboxOpen: true,
            lightboxIndex: index,
          },
          false,
          "openLightbox"
        ),

      closeLightbox: () =>
        set(
          {
            lightboxOpen: false,
            lightboxIndex: 0,
          },
          false,
          "closeLightbox"
        ),

      nextImage: () =>
        set((state) => {
          const maxIndex = state.filteredGalleryItems.length - 1;
          const newIndex = Math.min(state.lightboxIndex + 1, maxIndex);
          return { lightboxIndex: newIndex };
        }, false, "nextImage"),

      previousImage: () =>
        set((state) => {
          const newIndex = Math.max(state.lightboxIndex - 1, 0);
          return { lightboxIndex: newIndex };
        }, false, "previousImage"),

      // Gallery CRUD operations (local state)
      setGalleryItems: (items) =>
        set(
          {
            galleryItems: items,
            filteredGalleryItems: items,
          },
          false,
          "setGalleryItems"
        ),

      addGalleryItem: (item) =>
        set(
          (state) => ({
            galleryItems: [item, ...state.galleryItems],
          }),
          false,
          "addGalleryItem"
        ),

      updateGalleryItem: (itemId, updates) =>
        set(
          (state) => ({
            galleryItems: state.galleryItems.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }),
          false,
          "updateGalleryItem"
        ),

      deleteGalleryItem: (itemId) =>
        set(
          (state) => ({
            galleryItems: state.galleryItems.filter((item) => item.id !== itemId),
            selectedImageId:
              state.selectedImageId === itemId ? null : state.selectedImageId,
          }),
          false,
          "deleteGalleryItem"
        ),

      // Gallery CRUD operations (server sync with optimistic updates)
      uploadImage: async (file, metadata) => {
        const _state = get();
        const _fileId = `temp-${Date.now()}-${Math.random()}`;

        // Set uploading state
        set({ isUploading: true }, false, "uploadImage_start");

        try {
          // Create FormData
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", metadata.title);
          if (metadata.description) {
            formData.append("description", metadata.description);
          }
          formData.append("gameWorldId", metadata.gameWorldId);
          if (metadata.pinId) {
            formData.append("pinId", metadata.pinId);
          }
          if (metadata.loreEntryId) {
            formData.append("loreEntryId", metadata.loreEntryId);
          }

          // Upload to server
          const result = await uploadGalleryImage(formData);

          if (!result.success) {
            throw new Error(result.error.message);
          }

          // Add to store
          set(
            (state) => ({
              galleryItems: [result.data.galleryItem, ...state.galleryItems],
              isUploading: false,
            }),
            false,
            "uploadImage_success"
          );
        } catch (error) {
          set(
            {
              isUploading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to upload image",
            },
            false,
            "uploadImage_error"
          );
          throw error;
        }
      },

      deleteGalleryItemServer: async (itemId) => {
        const _state = get();
        const originalItem = _state.galleryItems.find((item) => item.id === itemId);

        // Optimistic delete
        set(
          (state) => ({
            galleryItems: state.galleryItems.filter((item) => item.id !== itemId),
            selectedImageId:
              state.selectedImageId === itemId ? null : state.selectedImageId,
          }),
          false,
          "deleteGalleryItem_optimistic"
        );

        try {
          await deleteGalleryItemAction(itemId);
        } catch (error) {
          // Rollback on error
          if (originalItem) {
            set(
              (state) => ({
                galleryItems: [...state.galleryItems, originalItem],
                selectedImageId: itemId,
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to delete image",
              }),
              false,
              "deleteGalleryItem_error"
            );
          }
          throw error;
        }
      },

      updateGalleryItemServer: async (data) => {
        const _state = get();
        const originalItem = _state.galleryItems.find(
          (item) => item.id === data.id
        );

        // Optimistic update
        const updates: Partial<GalleryItemWithRelations> = {};
        if (data.title !== undefined) updates.title = data.title;
        if (data.description !== undefined) updates.description = data.description;
        if (data.imageUrl !== undefined) updates.imageUrl = data.imageUrl;
        if (data.type !== undefined) updates.type = data.type;
        if (data.order !== undefined) updates.order = data.order;
        if (data.pinId !== undefined) updates.pinId = data.pinId;
        if (data.loreEntryId !== undefined) updates.loreEntryId = data.loreEntryId;

        set(
          (state) => ({
            galleryItems: state.galleryItems.map((item) =>
              item.id === data.id
                ? { ...item, ...updates, updatedAt: new Date() }
                : item
            ),
          }),
          false,
          "updateGalleryItem_optimistic"
        );

        try {
          const result = await updateGalleryItemAction(data);

          if (!result.success) {
            throw new Error(result.error.message);
          }

          // Update with server response
          set(
            (state) => ({
              galleryItems: state.galleryItems.map((item) =>
                item.id === data.id ? result.data : item
              ),
            }),
            false,
            "updateGalleryItem_success"
          );
        } catch (error) {
          // Rollback on error
          if (originalItem) {
            set(
              (state) => ({
                galleryItems: state.galleryItems.map((item) =>
                  item.id === data.id ? originalItem : item
                ),
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to update image",
              }),
              false,
              "updateGalleryItem_error"
            );
          }
          throw error;
        }
      },

      // Upload progress
      setUploadProgress: (fileId, progress) =>
        set(
          (state) => {
            const newProgress = new Map(state.uploadProgress);
            newProgress.set(fileId, progress);
            return { uploadProgress: newProgress };
          },
          false,
          "setUploadProgress"
        ),

      removeUploadProgress: (fileId) =>
        set(
          (state) => {
            const newProgress = new Map(state.uploadProgress);
            newProgress.delete(fileId);
            return { uploadProgress: newProgress };
          },
          false,
          "removeUploadProgress"
        ),

      // Filter actions
      setSearchTerm: (term) =>
        set({ searchTerm: term }, false, "setSearchTerm"),

      setTypeFilter: (type) =>
        set({ type }, false, "setTypeFilter"),

      setLinkedToFilter: (filter) =>
        set({ linkedTo: filter }, false, "setLinkedToFilter"),

      resetFilters: () =>
        set(
          {
            searchTerm: "",
            type: "ALL",
            linkedTo: "ALL",
          },
          false,
          "resetFilters"
        ),

      applyFilters: () => {
        const _state = get();
        const { galleryItems, searchTerm, type, linkedTo } = _state;

        const filtered = galleryItems.filter((item) => {
          // Search term filter
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
              item.title.toLowerCase().includes(searchLower) ||
              (item.description?.toLowerCase().includes(searchLower) ?? false);
            if (!matchesSearch) return false;
          }

          // Type filter
          if (type !== "ALL" && item.type !== type) {
            return false;
          }

          // Linked-to filter
          if (linkedTo === "PINS" && !item.pinId) {
            return false;
          }
          if (linkedTo === "LORE" && !item.loreEntryId) {
            return false;
          }
          if (linkedTo === "UNLINKED" && (item.pinId || item.loreEntryId)) {
            return false;
          }

          return true;
        });

        set({ filteredGalleryItems: filtered }, false, "applyFilters");
      },

      // Loading and error state
      setLoading: (isLoading) =>
        set({ isLoading }, false, "setLoading"),

      setError: (error) =>
        set({ error }, false, "setError"),

      // Reset all
      reset: () => set(initialState, false, "reset"),
    }),
    { name: "GalleryStore" }
  )
);
