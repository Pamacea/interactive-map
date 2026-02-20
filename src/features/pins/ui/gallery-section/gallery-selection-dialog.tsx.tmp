"use client";

import * as React from "react";
import Image from "next/image";
import { ImageIcon, Upload, Search, Plus, Grid3x3, Columns, Rows, LayoutGrid } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { ScrollArea } from "@/shared/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import { ImageUploadZone } from "@/features/gallery/ui/image-upload-zone";
import { useMutation } from "@tanstack/react-query";
import { galleryKeys } from "@/features/gallery/logic/use-gallery-query";

interface GallerySelectionDialogProps {
  worldId: string;
  pinId: string;
  linkedImages: GalleryItemWithRelations[];
  onImageLinked: (image: GalleryItemWithRelations) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Gallery Selection Dialog
 * Modal for selecting images from world gallery to link to a pin
 */
export function GallerySelectionDialog({
  worldId,
  pinId,
  linkedImages,
  onImageLinked,
  open,
  onOpenChange,
}: GallerySelectionDialogProps) {
  const [showUploadZone, setShowUploadZone] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [linkingImageId, setLinkingImageId] = React.useState<string | null>(null);

  // Fetch all world gallery items for selection
  const { data: allGalleryItems = [], isLoading: isLoadingGallery, refetch: refetchGallery } = useQuery({
    queryKey: galleryKeys.world(worldId),
    queryFn: async () => {
      const { getGalleryItemsByWorldWithDirect } = await import("@/features/gallery/actions");
      return getGalleryItemsByWorldWithDirect(worldId);
    },
    enabled: open,
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const results = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        formData.append("gameWorldId", worldId);
        formData.append("pinId", pinId);

        const { uploadGalleryImage } = await import("@/features/gallery/actions");
        const result = await uploadGalleryImage(formData);
        if (result.success) {
          results.push(result.data.galleryItem);
        } else {
          throw new Error(result.error?.message || "Upload failed");
        }
      }
      return results;
    },
    onSuccess: (uploadedImages) => {
      refetchGallery();
      setShowUploadZone(false);
      uploadedImages.forEach((img) => {
        onImageLinked(img);
      });
    },
  });

  // Filter out already linked images and apply search
  const availableImages = React.useMemo(() => {
    const linkedIds = new Set(linkedImages.map((img) => img.id));
    return allGalleryItems
      .filter((img) => !linkedIds.has(img.id))
      .filter((img) =>
        searchTerm === ""
          ? true
          : img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            img.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [allGalleryItems, linkedImages, searchTerm]);

  const handleLinkImage = async (imageId: string) => {
    setLinkingImageId(imageId);
    try {
      const { linkGalleryItemToPin } = await import("@/features/gallery/actions");
      const result = await linkGalleryItemToPin(imageId, pinId);
      if (result.success) {
        const linkedImage = allGalleryItems.find((img) => img.id === imageId);
        if (linkedImage) {
          onImageLinked(linkedImage);
        }
        onOpenChange(false);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Failed to link image:", error);
    } finally {
      setLinkingImageId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (open) setShowUploadZone(false);
    }}>
      <DialogContent className="bg-obsidian border border-border-subtle max-w-1/3 max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Link Image from Gallery</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Select an image from your world gallery to link to this pin, or upload a new image.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Toggle between gallery and upload */}
          <div className="flex gap-2 border-b border-border-subtle">
            <button
              onClick={() => setShowUploadZone(false)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                !showUploadZone
                  ? "border-accent-gold text-accent-gold"
                  : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              Gallery
            </button>
            <button
              onClick={() => setShowUploadZone(true)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                showUploadZone
                  ? "border-accent-gold text-accent-gold"
                  : "border-transparent text-text-muted hover:text-text-primary"
              )}
            >
              <Upload className="w-4 h-4 mr-1 inline" />
              Upload New
            </button>
          </div>

          {showUploadZone ? (
            <div className="py-2">
              <ImageUploadZone
                onUpload={async (files) => {
                  await uploadMutation.mutateAsync(files);
                }}
                maxSize={10 * 1024 * 1024}
              />
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search images..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background-input border border-border-subtle text-text-primary"
                />
              </div>

              {/* Image grid */}
              <ScrollArea className="h-72 pr-4">
                {isLoadingGallery ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-4 border-border-base border-t-accent-gold rounded-sm animate-spin" />
                  </div>
                ) : availableImages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center py-8">
                    <ImageIcon className="w-12 h-12 text-text-muted mb-3" />
                    <p className="text-text-secondary text-sm">
                      {searchTerm ? "No matching images found" : "No images in gallery yet"}
                    </p>
                    {!searchTerm && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowUploadZone(true)}
                        className="mt-3"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload an Image
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {availableImages.map((image) => (
                      <button
                        key={image.id}
                        onClick={() => handleLinkImage(image.id)}
                        disabled={linkingImageId === image.id}
                        className={cn(
                          "relative aspect-square rounded-sm overflow-hidden border-2 border-transparent hover:border-accent-gold transition-all group",
                          linkingImageId === image.id && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Image
                          src={image.imageUrl}
                          alt={image.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-2">
                            <p className="text-white text-xs font-medium truncate">
                              {image.title}
                            </p>
                          </div>
                        </div>
                        {linkingImageId === image.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-sm animate-spin" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
