"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, X, Plus, Search, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import { linkGalleryItemToPin, uploadGalleryImage } from "@/actions/gallery";
import { useQuery, useMutation } from "@tanstack/react-query";
import { galleryKeys } from "@/components/gallery/logic/use-gallery-query";
import { ImageUploadZone } from "@/components/gallery/ui/image-upload-zone";

interface PinGallerySectionProps {
  pinId: string;
  worldId: string;
  linkedImages?: GalleryItemWithRelations[];
  onImageLinked?: (image: GalleryItemWithRelations) => void;
  onImageUnlinked?: (imageId: string) => void;
}

export function PinGallerySection({
  pinId,
  worldId,
  linkedImages = [],
  onImageLinked,
  onImageUnlinked,
}: PinGallerySectionProps) {
  const [linkingImageId, setLinkingImageId] = React.useState<string | null>(null);
  const [unlinkingImageId, setUnlinkingImageId] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [showUploadZone, setShowUploadZone] = React.useState(false);

  // Fetch all world gallery items for selection
  const { data: allGalleryItems = [], isLoading: isLoadingGallery, refetch: refetchGallery } = useQuery({
    queryKey: galleryKeys.world(worldId),
    queryFn: async () => {
      const { getGalleryItemsByWorldWithDirect } = await import("@/actions/gallery");
      return getGalleryItemsByWorldWithDirect(worldId);
    },
    enabled: isDialogOpen,
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
        formData.append("pinId", pinId); // Link directly to this pin

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
      // Refresh gallery to show newly uploaded images
      refetchGallery();
      setShowUploadZone(false);
      // Notify parent of newly linked images
      uploadedImages.forEach((img) => {
        onImageLinked?.(img);
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
      const result = await linkGalleryItemToPin(imageId, pinId);
      if (result.success) {
        const linkedImage = allGalleryItems.find((img) => img.id === imageId);
        if (linkedImage) {
          onImageLinked?.(linkedImage);
        }
        setIsDialogOpen(false);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Failed to link image:", error);
    } finally {
      setLinkingImageId(null);
    }
  };

  const handleUnlinkImage = async (imageId: string) => {
    setUnlinkingImageId(imageId);
    try {
      // To unlink, we set pinId to null via updateGalleryItem
      const { updateGalleryItem } = await import("@/actions/gallery");
      const result = await updateGalleryItem({ id: imageId, pinId: null });
      if (result.success) {
        onImageUnlinked?.(imageId);
      }
    } catch (error) {
      console.error("Failed to unlink image:", error);
    } finally {
      setUnlinkingImageId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Images
        </h4>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (open) setShowUploadZone(false);
        }}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs text-accent-gold hover:text-accent-gold/80"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Image
            </Button>
          </DialogTrigger>
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
                // Upload zone
                <div className="py-2">
                  <ImageUploadZone
                    onUpload={async (files) => {
                      await uploadMutation.mutateAsync(files);
                    }}
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                </div>
              ) : (
                // Gallery selection
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
      </div>

      {/* Linked images grid */}
      {linkedImages.length === 0 ? (
        <div
          className="rounded-sm p-4 -mx-4 text-center border border-dashed border-border-subtle hover:border-accent-gold/50 transition-colors cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <ImageIcon className="w-8 h-8 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-secondary">No images linked</p>
          <p className="text-xs text-text-muted mt-1">
            Click to add images from your gallery
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {linkedImages.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square rounded-sm overflow-hidden border border-border-subtle group"
            >
              <Image
                src={image.imageUrl}
                alt={image.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-white hover:text-red-500"
                  onClick={() => handleUnlinkImage(image.id)}
                  disabled={unlinkingImageId === image.id}
                  title="Unlink image"
                >
                  {unlinkingImageId === image.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-sm animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-medium truncate">
                  {image.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image count badge */}
      {linkedImages.length > 0 && (
        <div className="flex items-center justify-between text-xs text-text-muted pt-1">
          <span>{linkedImages.length} image{linkedImages.length > 1 ? "s" : ""} linked</span>
        </div>
      )}
    </div>
  );
}
