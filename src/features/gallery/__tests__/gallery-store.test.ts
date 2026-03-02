/**
 *
 * Unit tests for the gallery Zustand store (local state only)
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mock server actions before importing the store
vi.mock("@/features/gallery/actions", () => ({
  createGalleryItem: vi.fn(),
  updateGalleryItem: vi.fn(),
  deleteGalleryItem: vi.fn(),
  reorderGalleryItems: vi.fn(),
}));

import { useGalleryStore } from "../store/use-gallery-store";
import type { GalleryItemWithRelations, MediaType } from "@/types/gallery.type";

// ============================================
// TEST DATA
// ============================================

const mockGalleryItems: GalleryItemWithRelations[] = [
  {
    id: "gallery-1",
    title: "Map of Middle-earth",
    slug: "map-of-middle-earth",
    description: "A detailed map showing key locations",
    imageUrl: "/uploads/gallery/map.jpg",
    type: "IMAGE",
    order: 0,
    worldId: "world-1",
    pinId: "pin-1",
    loreEntryId: null,
    caption: null,
    tags: ["map", "geography"],
    createdAt: new Date(),
    updatedAt: new Date(),
    pin: {
      id: "pin-1",
      title: "Rivendell",
    },
    loreEntry: null,
  },
  {
    id: "gallery-2",
    title: "Character Portrait: Gandalf",
    slug: "character-portrait-gandalf",
    description: "The wizard Gandalf the Grey",
    imageUrl: "/uploads/gallery/gandalf.jpg",
    type: "IMAGE",
    order: 1,
    worldId: "world-1",
    pinId: null,
    loreEntryId: "lore-1",
    caption: "Gandalf the Grey",
    tags: ["character", "wizard"],
    createdAt: new Date(),
    updatedAt: new Date(),
    pin: null,
    loreEntry: {
      id: "lore-1",
      title: "Gandalf",
    },
  },
  {
    id: "gallery-3",
    title: "Unlinked Image",
    slug: "unlinked-image",
    description: "Not linked to any pin or lore",
    imageUrl: "/uploads/gallery/misc.jpg",
    type: "IMAGE",
    order: 2,
    worldId: "world-1",
    pinId: null,
    loreEntryId: null,
    caption: null,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    pin: null,
    loreEntry: null,
  },
];

// ============================================
// SETUP
// ============================================

beforeEach(() => {
  // Reset store state before each test
  useGalleryStore.getState().reset();
});

// ============================================
// UI STATE TESTS
// ============================================

describe("Gallery Store - UI State", () => {
  it("should have initial state", () => {
    const { result } = renderHook(() => useGalleryStore());

    expect(result.current.selectedImageId).toBeNull();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.lightboxOpen).toBe(false);
    expect(result.current.lightboxIndex).toBe(0);
  });

  it("should select image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.selectImage("gallery-1");
    });

    expect(result.current.selectedImageId).toBe("gallery-1");
  });

  it("should clear selection", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.selectImage("gallery-1");
    });

    act(() => {
      result.current.clearSelection();
    });

    expect(result.current.selectedImageId).toBeNull();
  });

  it("should start uploading mode", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.startUploading();
    });

    expect(result.current.isUploading).toBe(true);

    act(() => {
      result.current.stopUploading();
    });

    expect(result.current.isUploading).toBe(false);
  });

  it("should start editing mode", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.startEditing();
    });

    expect(result.current.isEditing).toBe(true);

    act(() => {
      result.current.stopEditing();
    });

    expect(result.current.isEditing).toBe(false);
  });
});

// ============================================
// LIGHTBOX TESTS
// ============================================

describe("Gallery Store - Lightbox", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useGalleryStore());
    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
    });
  });

  it("should open lightbox at specific index", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(1);
    });

    expect(result.current.lightboxOpen).toBe(true);
    expect(result.current.lightboxIndex).toBe(1);
  });

  it("should close lightbox", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(0);
      result.current.closeLightbox();
    });

    expect(result.current.lightboxOpen).toBe(false);
    expect(result.current.lightboxIndex).toBe(0);
  });

  it("should navigate to next image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(0);
      result.current.nextImage();
    });

    expect(result.current.lightboxIndex).toBe(1);
  });

  it("should not navigate beyond last image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(2);
      result.current.nextImage();
    });

    expect(result.current.lightboxIndex).toBe(2); // Stays at last index
  });

  it("should navigate to previous image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(1);
      result.current.previousImage();
    });

    expect(result.current.lightboxIndex).toBe(0);
  });

  it("should not navigate before first image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(0);
      result.current.previousImage();
    });

    expect(result.current.lightboxIndex).toBe(0); // Stays at first index
  });

  it("should navigate through multiple images", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.openLightbox(0);
      result.current.nextImage();
      result.current.nextImage();
      result.current.previousImage();
    });

    expect(result.current.lightboxIndex).toBe(1);
  });
});

// ============================================
// GALLERY DATA MANAGEMENT TESTS
// ============================================

describe("Gallery Store - Gallery Data", () => {
  it("should set gallery items", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
    });

    expect(result.current.galleryItems).toEqual(mockGalleryItems);
    expect(result.current.filteredGalleryItems).toEqual(mockGalleryItems);
    expect(result.current.galleryItems).toHaveLength(3);
  });

  it("should add gallery item (prepends to array)", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setGalleryItems([mockGalleryItems[0]]);
      result.current.addGalleryItem(mockGalleryItems[1]);
    });

    expect(result.current.galleryItems).toHaveLength(2);
    expect(result.current.galleryItems[0].id).toBe("gallery-2"); // Prepended
  });

  it("should update gallery item", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
      result.current.updateGalleryItem("gallery-1", { title: "Updated Map" });
    });

    expect(result.current.galleryItems[0].title).toBe("Updated Map");
    expect(result.current.galleryItems[1].title).toBe("Character Portrait: Gandalf"); // Unchanged
  });

  it("should delete gallery item", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
      result.current.deleteGalleryItem("gallery-1");
    });

    expect(result.current.galleryItems).toHaveLength(2);
    expect(result.current.galleryItems[0].id).toBe("gallery-2");
  });

  it("should clear selection when deleting selected image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
      result.current.selectImage("gallery-1");
      result.current.deleteGalleryItem("gallery-1");
    });

    expect(result.current.selectedImageId).toBeNull();
  });

  it("should preserve selection when deleting non-selected image", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
      result.current.selectImage("gallery-1");
      result.current.deleteGalleryItem("gallery-2");
    });

    expect(result.current.selectedImageId).toBe("gallery-1");
  });
});

// ============================================
// UPLOAD PROGRESS TESTS
// ============================================

describe("Gallery Store - Upload Progress", () => {
  it("should set upload progress for a file", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setUploadProgress("file-1", 50);
    });

    expect(result.current.uploadProgress.get("file-1")).toBe(50);
  });

  it("should track multiple file uploads", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setUploadProgress("file-1", 25);
      result.current.setUploadProgress("file-2", 75);
      result.current.setUploadProgress("file-3", 100);
    });

    expect(result.current.uploadProgress.size).toBe(3);
    expect(result.current.uploadProgress.get("file-1")).toBe(25);
    expect(result.current.uploadProgress.get("file-2")).toBe(75);
    expect(result.current.uploadProgress.get("file-3")).toBe(100);
  });

  it("should update progress for existing file", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setUploadProgress("file-1", 25);
      result.current.setUploadProgress("file-1", 50);
      result.current.setUploadProgress("file-1", 100);
    });

    expect(result.current.uploadProgress.get("file-1")).toBe(100);
    expect(result.current.uploadProgress.size).toBe(1);
  });

  it("should remove upload progress", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setUploadProgress("file-1", 100);
      result.current.removeUploadProgress("file-1");
    });

    expect(result.current.uploadProgress.get("file-1")).toBeUndefined();
    expect(result.current.uploadProgress.size).toBe(0);
  });
});

// ============================================
// FILTER STATE TESTS
// ============================================

describe("Gallery Store - Filter State", () => {
  it("should have initial filter state", () => {
    const { result } = renderHook(() => useGalleryStore());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.type).toBe("ALL");
    expect(result.current.linkedTo).toBe("ALL");
  });

  it("should set search term", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("map");
    });

    expect(result.current.searchTerm).toBe("map");
  });

  it("should set type filter", () => {
    const { result } = renderHook(() => useGalleryStore());

    const mediaTypes: MediaType[] = ["IMAGE", "VIDEO"];

    mediaTypes.forEach((type) => {
      act(() => {
        result.current.setTypeFilter(type);
      });

      expect(result.current.type).toBe(type);
    });
  });

  it("should reset type to ALL", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setTypeFilter("IMAGE");
    });

    expect(result.current.type).toBe("IMAGE");

    act(() => {
      result.current.setTypeFilter("ALL");
    });

    expect(result.current.type).toBe("ALL");
  });

  it("should set linked-to filter", () => {
    const { result } = renderHook(() => useGalleryStore());

    const filters: Array<"ALL" | "PINS" | "LORE" | "UNLINKED"> = [
      "ALL",
      "PINS",
      "LORE",
      "UNLINKED",
    ];

    filters.forEach((filter) => {
      act(() => {
        result.current.setLinkedToFilter(filter);
      });

      expect(result.current.linkedTo).toBe(filter);
    });
  });

  it("should reset all filters", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("test");
      result.current.setTypeFilter("IMAGE");
      result.current.setLinkedToFilter("PINS");
    });

    expect(result.current.searchTerm).toBe("test");
    expect(result.current.type).toBe("IMAGE");
    expect(result.current.linkedTo).toBe("PINS");

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.searchTerm).toBe("");
    expect(result.current.type).toBe("ALL");
    expect(result.current.linkedTo).toBe("ALL");
  });
});

// ============================================
// FILTER APPLICATION TESTS
// ============================================

describe("Gallery Store - Filter Application", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useGalleryStore());
    act(() => {
      result.current.setGalleryItems(mockGalleryItems);
    });
  });

  it("should filter by search term (title)", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("map");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].title).toBe("Map of Middle-earth");
  });

  it("should filter by search term (description)", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("wizard");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].title).toBe("Character Portrait: Gandalf");
  });

  it("should be case insensitive for search term", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("MAP");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
  });

  it("should filter by type", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setTypeFilter("IMAGE");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(3);
  });

  it("should filter by linked-to PINS", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setLinkedToFilter("PINS");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].pinId).toBe("pin-1");
  });

  it("should filter by linked-to LORE", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setLinkedToFilter("LORE");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].loreEntryId).toBe("lore-1");
  });

  it("should filter by UNLINKED", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setLinkedToFilter("UNLINKED");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].id).toBe("gallery-3");
  });

  it("should apply combined filters", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("image");
      result.current.setLinkedToFilter("UNLINKED");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].title).toBe("Unlinked Image");
  });

  it("should return all items when no filters active", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(3);
  });

  it("should return empty when search matches nothing", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setSearchTerm("NonExistent");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(0);
  });

  it("should return empty when PINS filter but no pins", () => {
    const { result } = renderHook(() => useGalleryStore());

    // Create items without pins
    const noPinItems = [
      { ...mockGalleryItems[2] },
      { ...mockGalleryItems[2], id: "gallery-4" },
    ];

    act(() => {
      result.current.setGalleryItems(noPinItems);
      result.current.setLinkedToFilter("PINS");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(0);
  });
});

// ============================================
// LOADING AND ERROR STATE TESTS
// ============================================

describe("Gallery Store - Loading and Error State", () => {
  it("should set loading state", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it("should set error", () => {
    const { result } = renderHook(() => useGalleryStore());

    act(() => {
      result.current.setError("Failed to load gallery");
    });

    expect(result.current.error).toBe("Failed to load gallery");

    act(() => {
      result.current.setError(null);
    });

    expect(result.current.error).toBeNull();
  });
});

// ============================================
// RESET TESTS
// ============================================

describe("Gallery Store - Reset", () => {
  it("should reset to initial state", () => {
    const { result } = renderHook(() => useGalleryStore());

    // Set various states
    act(() => {
      result.current.selectImage("gallery-1");
      result.current.setGalleryItems(mockGalleryItems);
      result.current.setSearchTerm("test");
      result.current.setLoading(true);
      result.current.setError("error");
      result.current.startUploading();
      result.current.startEditing();
      result.current.openLightbox(1);
      result.current.setTypeFilter("IMAGE");
      result.current.setLinkedToFilter("PINS");
      result.current.setUploadProgress("file-1", 50);
    });

    // Verify states are set
    expect(result.current.selectedImageId).toBe("gallery-1");
    expect(result.current.galleryItems).toHaveLength(3);
    expect(result.current.searchTerm).toBe("test");
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe("error");
    expect(result.current.isUploading).toBe(true);
    expect(result.current.isEditing).toBe(true);
    expect(result.current.lightboxOpen).toBe(true);
    expect(result.current.type).toBe("IMAGE");
    expect(result.current.linkedTo).toBe("PINS");
    expect(result.current.uploadProgress.size).toBe(1);

    // Reset
    act(() => {
      result.current.reset();
    });

    // Verify reset to initial
    expect(result.current.selectedImageId).toBeNull();
    expect(result.current.galleryItems).toHaveLength(0);
    expect(result.current.searchTerm).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isUploading).toBe(false);
    expect(result.current.isEditing).toBe(false);
    expect(result.current.lightboxOpen).toBe(false);
    expect(result.current.lightboxIndex).toBe(0);
    expect(result.current.type).toBe("ALL");
    expect(result.current.linkedTo).toBe("ALL");
    expect(result.current.uploadProgress.size).toBe(0);
  });
});

// ============================================
// MEDIA TYPE FILTER COMPREHENSIVE TESTS
// ============================================

describe("Gallery Store - Media Type Filters", () => {
  it("should accept all media type options", () => {
    const { result } = renderHook(() => useGalleryStore());

    const mediaTypes: Array<MediaType | "ALL"> = [
      "ALL",
      "IMAGE",
      "VIDEO",
    ];

    mediaTypes.forEach((type) => {
      act(() => {
        result.current.setTypeFilter(type);
      });

      expect(result.current.type).toBe(type);
    });
  });

  it("should filter correctly by IMAGE type", () => {
    const { result } = renderHook(() => useGalleryStore());

    const items: GalleryItemWithRelations[] = [
      { ...mockGalleryItems[0], type: "IMAGE" as const },
      { ...mockGalleryItems[1], type: "VIDEO" as const, id: "gallery-4" },
    ];

    act(() => {
      result.current.setGalleryItems(items);
      result.current.setTypeFilter("IMAGE");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].type).toBe("IMAGE");
  });

  it("should filter correctly by VIDEO type", () => {
    const { result } = renderHook(() => useGalleryStore());

    const items: GalleryItemWithRelations[] = [
      { ...mockGalleryItems[0], type: "IMAGE" as const },
      { ...mockGalleryItems[1], type: "VIDEO" as const, id: "gallery-4" },
    ];

    act(() => {
      result.current.setGalleryItems(items);
      result.current.setTypeFilter("VIDEO");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(1);
    expect(result.current.filteredGalleryItems[0].type).toBe("VIDEO");
  });

  it("should show all types when filter is ALL", () => {
    const { result } = renderHook(() => useGalleryStore());

    const items: GalleryItemWithRelations[] = [
      { ...mockGalleryItems[0], type: "IMAGE" as const },
      { ...mockGalleryItems[1], type: "VIDEO" as const, id: "gallery-4" },
      { ...mockGalleryItems[2], type: "IMAGE" as const, id: "gallery-5" },
    ];

    act(() => {
      result.current.setGalleryItems(items);
      result.current.setTypeFilter("ALL");
      result.current.applyFilters();
    });

    expect(result.current.filteredGalleryItems).toHaveLength(3);
  });
});
