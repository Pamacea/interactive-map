"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, Grid3x3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageCard } from "./image-card";
import { ImageLightbox } from "./image-lightbox";
import { ImageUploadZone } from "./image-upload-zone";
import { useGalleryStore } from "@/stores/use-gallery-store";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

export interface ImageGalleryProps {
  worldId: string;
  className?: string;
}

export function ImageGallery({ worldId, className }: ImageGalleryProps) {
  const galleryStore = useGalleryStore();

  const {
    filteredGalleryItems,
    searchTerm,
    isLoading,
    lightboxOpen,
    lightboxIndex,
    setSearchTerm,
    applyFilters,
    openLightbox,
    closeLightbox,
    nextImage,
    previousImage,
    selectImage,
    uploadImage,
    deleteGalleryItemServer,
  } = galleryStore;

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);

  // Apply filters when search term changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, applyFilters]);

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        await uploadImage(file, {
          title: file.name,
          gameWorldId: worldId,
        });
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
    setShowUpload(false);
  };

  const handleImageClick = (index: number) => {
    selectImage(filteredGalleryItems[index].id);
    openLightbox(index);
  };

  const handleDelete = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteGalleryItemServer(imageId);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border-subtle space-y-3">
        {/* Title and upload button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-text-primary">
            Image Gallery
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowUpload(!showUpload)}
          >
            {showUpload ? "Cancel" : "Upload Images"}
          </Button>
        </div>

        {/* Upload zone */}
        {showUpload && (
          <div className="pb-4">
            <ImageUploadZone onUpload={handleUpload} />
          </div>
        )}

        {/* Search and filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            <Input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className={cn(
              "flex-shrink-0",
              viewMode === "grid" && "bg-accent-gold text-background-base border-accent-gold"
            )}
          >
            {viewMode === "grid" ? (
              <Grid3x3 className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Gallery content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-border-base border-t-accent-gold rounded-full animate-spin mx-auto" />
                <p className="text-text-secondary text-sm">Loading images...</p>
              </div>
            </div>
          ) : filteredGalleryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="w-16 h-16 bg-background-elevated rounded-full flex items-center justify-center">
                <Filter className="w-8 h-8 text-text-muted" />
              </div>
              <div>
                <p className="text-text-primary font-medium">No images found</p>
                <p className="text-text-secondary text-sm">
                  {searchTerm
                    ? "Try a different search term"
                    : "Upload images to get started"}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "grid gap-3",
                viewMode === "grid"
                  ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {filteredGalleryItems.map((image, index) => (
                <ImageCard
                  key={image.id}
                  image={image}
                  isSelected={galleryStore.selectedImageId === image.id}
                  onSelect={() => handleImageClick(index)}
                  onEdit={() => {
                    /* TODO: Implement edit dialog */
                  }}
                  onDelete={() => handleDelete(image.id)}
                  onLinkToPin={() => {
                    /* TODO: Implement link to pin dialog */
                  }}
                  onLinkToLore={() => {
                    /* TODO: Implement link to lore dialog */
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Lightbox */}
      <ImageLightbox
        images={filteredGalleryItems}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrevious={previousImage}
        onLinkToPin={(image) => {
          /* TODO: Implement link to pin dialog */
        }}
        onLinkToLore={(image) => {
          /* TODO: Implement link to lore dialog */
        }}
      />
    </div>
  );
}
