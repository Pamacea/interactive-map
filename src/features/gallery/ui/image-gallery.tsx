"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Grid3x3, List } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { ImageCard } from "./image-card";
import { ImageLightbox } from "./image-lightbox";
import { ImageUploadZone } from "./image-upload-zone";
import { DeleteConfirmDialog } from "@/shared/ui/delete-confirm-dialog";
import { EditImageDialog } from "./edit-image-dialog";
import { LinkToPinDialog } from "./link-to-pin-dialog";
import { LinkToLoreDialog } from "./link-to-lore-dialog";
import { useGalleryStore } from "@/features/gallery/store";
import { useGallery } from "../logic/use-gallery-query";
import { galleryKeys } from "../logic/use-gallery-query";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import { usePins } from "@/features/pins/store";

export interface ImageGalleryProps {
  worldId: string;
  className?: string;
}

export function ImageGallery({ worldId, className }: ImageGalleryProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // New dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [linkToPinDialogOpen, setLinkToPinDialogOpen] = useState(false);
  const [linkToLoreDialogOpen, setLinkToLoreDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItemWithRelations | null>(null);

  // TanStack Query for data fetching
  const { data: galleryItems = [], isLoading: isLoadingQuery, refetch } = useGallery(worldId);
  const _queryClient = useQueryClient();

  // Fetch pins for linking (from store)
  const pins = usePins();

  // Get lore entries from gallery items (they have lore relations)
  const loreEntries = galleryItems
    .map((item) => item.loreEntry)
    .filter((lore): lore is NonNullable<typeof lore> => lore !== null);

  const galleryStore = useGalleryStore();

  const {
    setGalleryItems,
    filteredGalleryItems,
    searchTerm,
    lightboxOpen,
    lightboxIndex,
    setSearchTerm,
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

  // Sync gallery items from TanStack Query to store
  useEffect(() => {
    setGalleryItems(galleryItems);
  }, [galleryItems, setGalleryItems]);

  // Apply filters when search term changes or gallery items update
  useEffect(() => {
    galleryStore.applyFilters();
  }, [searchTerm, galleryItems, galleryStore]);

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
    // Refetch gallery items to get fresh data
    refetch();
  };

  const handleImageClick = (index: number) => {
    selectImage(filteredGalleryItems[index].id);
    openLightbox(index);
  };

  const handleDelete = async (imageId: string) => {
    setImageToDelete(imageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    try {
      setIsDeleting(true);
      await deleteGalleryItemServer(imageToDelete);
      setDeleteDialogOpen(false);
      setImageToDelete(null);
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: galleryKeys.world(worldId) });
    } catch (error) {
      console.error("Failed to delete image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (image: GalleryItemWithRelations) => {
    setSelectedImage(image);
    setEditDialogOpen(true);
  };

  const handleLinkToPin = (image: GalleryItemWithRelations) => {
    setSelectedImage(image);
    setLinkToPinDialogOpen(true);
  };

  const handleLinkToLore = (image: GalleryItemWithRelations) => {
    setSelectedImage(image);
    setLinkToLoreDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    // Invalidate queries to refresh data
    queryClient.invalidateQueries({ queryKey: galleryKeys.world(worldId) });
    refetch();
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
          {isLoadingQuery ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 border-4 border-border-base border-t-accent-gold rounded-sm animate-spin mx-auto" />
                <p className="text-text-secondary text-sm">Loading images...</p>
              </div>
            </div>
          ) : filteredGalleryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="w-16 h-16 bg-background-elevated rounded-sm flex items-center justify-center">
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
                  onEdit={() => handleEdit(image)}
                  onDelete={() => handleDelete(image.id)}
                  onLinkToPin={() => handleLinkToPin(image)}
                  onLinkToLore={() => handleLinkToLore(image)}
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
        onLinkToPin={(image) => handleLinkToPin(image)}
        onLinkToLore={(image) => handleLinkToLore(image)}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        title="Delete Image?"
        description="Are you sure you want to delete this image? This action cannot be undone."
      />

      {/* Edit image dialog */}
      {selectedImage && (
        <EditImageDialog
          image={selectedImage}
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Link to pin dialog */}
      {selectedImage && (
        <LinkToPinDialog
          image={selectedImage}
          pins={pins}
          open={linkToPinDialogOpen}
          onClose={() => setLinkToPinDialogOpen(false)}
          onSuccess={handleDialogSuccess}
        />
      )}

      {/* Link to lore dialog */}
      {selectedImage && (
        <LinkToLoreDialog
          image={selectedImage}
          loreEntries={loreEntries}
          open={linkToLoreDialogOpen}
          onClose={() => setLinkToLoreDialogOpen(false)}
          onSuccess={handleDialogSuccess}
        />
      )}
    </div>
  );
}
