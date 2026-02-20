"use client";

import * as React from "react";
import Image from "next/image";
import { Image as ImageIcon, X, Plus, Search, Upload, Grid3x3, Columns, Rows, LayoutGrid, Pencil } from "lucide-react";
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
import { linkGalleryItemToPin, uploadGalleryImage, updateGalleryItem } from "@/actions/gallery";
import { useQuery, useMutation } from "@tanstack/react-query";
import { galleryKeys } from "@/components/gallery/logic/use-gallery-query";
import { ImageUploadZone } from "@/components/gallery/ui/image-upload-zone";

type GalleryLayout = "grid-3" | "grid-2" | "vertical-1-2" | "horizontal-3";

const LAYOUTS: Record<GalleryLayout, { name: string; cols: number; rows?: number }> = {
  "grid-3": { name: "Grid 3x", cols: 3 },
  "grid-2": { name: "Grid 2x", cols: 2 },
  "vertical-1-2": { name: "1+2", cols: 2, rows: 3 },
  "horizontal-3": { name: "3 Row", cols: 1, rows: 3 },
};

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
  const [layout, setLayout] = React.useState<GalleryLayout>("grid-3");

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
        formData.append("pinId", pinId);

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
      const { updateGalleryItem: updateItem } = await import("@/actions/gallery");
      const result = await updateItem({ id: imageId, pinId: null });
      if (result.success) {
        onImageUnlinked?.(imageId);
      }
    } catch (error) {
      console.error("Failed to unlink image:", error);
    } finally {
      setUnlinkingImageId(null);
    }
  };

  const handleCaptionUpdate = async (imageId: string, caption: string) => {
    try {
      const { updateGalleryItemCaption } = await import("@/actions/gallery");
      await updateGalleryItemCaption(imageId, caption);
      const updatedImage = linkedImages.find(img => img.id === imageId);
      if (updatedImage) {
        onImageLinked?.({ ...updatedImage, caption } as GalleryItemWithRelations);
      }
    } catch (error) {
      console.error("Failed to update caption:", error);
    }
  };

  const handleTitleUpdate = async (imageId: string, title: string) => {
    try {
      const result = await updateGalleryItem({ id: imageId, title });
      if (result.success) {
        const updatedImage = linkedImages.find(img => img.id === imageId);
        if (updatedImage) {
          onImageLinked?.({ ...updatedImage, title } as GalleryItemWithRelations);
        }
      }
    } catch (error) {
      console.error("Failed to update title:", error);
    }
  };

  const getGridClass = (): string => {
    switch (layout) {
      case "grid-3":
        return "grid grid-cols-3 gap-2";
      case "grid-2":
        return "grid grid-cols-2 gap-2";
      case "vertical-1-2":
        return "grid grid-cols-2 gap-2";
      case "horizontal-3":
        return "grid grid-cols-1 gap-2";
      default:
        return "grid grid-cols-3 gap-2";
    }
  };

  const getImageClass = (index: number): string => {
    if (layout === "vertical-1-2") {
      return index === 0 ? "row-span-2" : "";
    }
    return "";
  };

  return (
    <div className="space-y-4">
      {/* Header with layout selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Gallery
          </h4>
          {linkedImages.length > 0 && (
            <span className="text-xs text-text-muted">
              {linkedImages.length} image{linkedImages.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Layout selector */}
          <div className="flex items-center border border-border-subtle rounded-sm overflow-hidden">
            {(Object.entries(LAYOUTS) as [GalleryLayout, { name: string; cols: number }][]).map(([key, { name }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setLayout(key as GalleryLayout)}
                className={cn(
                  "px-2 py-1 text-xs transition-colors",
                  layout === key
                    ? "bg-accent-gold/20 text-accent-gold"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5"
                )}
                title={name}
              >
                {key === "grid-3" && <Grid3x3 className="h-3 w-3" />}
                {key === "grid-2" && <Columns className="h-3 w-3" />}
                {key === "vertical-1-2" && <LayoutGrid className="h-3 w-3" />}
                {key === "horizontal-3" && <Rows className="h-3 w-3" />}
              </button>
            ))}
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (open) setShowUploadZone(false);
          }}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-3 text-xs text-accent-gold hover:text-accent-gold/80 border border-accent-gold/30 hover:bg-accent-gold/20"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add
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
        </div>
      </div>

      {/* Linked images grid with layouts */}
      {linkedImages.length === 0 ? (
        <div
          className="rounded-sm p-6 -mx-4 text-center border border-dashed border-border-subtle hover:border-accent-gold/50 transition-colors cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <ImageIcon className="w-10 h-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">No images linked</p>
          <p className="text-xs text-text-muted mt-2">
            Click to add images from your gallery
          </p>
        </div>
      ) : (
        <div className={cn(getGridClass(), layout === "horizontal-3" ? "max-h-96 overflow-y-auto pr-1" : "")}>
          {linkedImages.map((image, index) => (
            <GalleryImageCard
              key={image.id}
              image={image}
              onUnlink={() => handleUnlinkImage(image.id)}
              isUnlinking={unlinkingImageId === image.id}
              onCaptionUpdate={(caption) => handleCaptionUpdate(image.id, caption)}
              onTitleUpdate={(title) => handleTitleUpdate(image.id, title)}
              sizeClass={getImageClass(index)}
              layout={layout}
            />
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

interface GalleryImageCardProps {
  image: GalleryItemWithRelations & { caption?: string | null };
  onUnlink: () => void;
  isUnlinking: boolean;
  onCaptionUpdate: (caption: string) => void;
  onTitleUpdate: (title: string) => void;
  sizeClass?: string;
  layout: GalleryLayout;
}

function GalleryImageCard({
  image,
  onUnlink,
  isUnlinking,
  onCaptionUpdate,
  onTitleUpdate,
  sizeClass = "",
  layout
}: GalleryImageCardProps) {
  const [isEditingCaption, setIsEditingCaption] = React.useState(false);
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedCaption, setEditedCaption] = React.useState(image.caption || "");
  const [editedTitle, setEditedTitle] = React.useState(image.title || "");
  const [showFullCaption, setShowFullCaption] = React.useState(false);
  const captionInputRef = React.useRef<HTMLInputElement>(null);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const displayCaption = image.caption || "";
  const isLongCaption = displayCaption.length > 40;
  const aspectRatio = layout === "horizontal-3" ? "aspect-video" : "aspect-square";

  React.useEffect(() => {
    if (isEditingCaption) {
      captionInputRef.current?.focus();
      captionInputRef.current?.select();
    }
  }, [isEditingCaption]);

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveCaption = () => {
    onCaptionUpdate(editedCaption);
    setIsEditingCaption(false);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onTitleUpdate(editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    } else if (e.key === "Escape") {
      if (isEditingCaption) {
        setEditedCaption(image.caption || "");
        setIsEditingCaption(false);
      } else {
        setEditedTitle(image.title || "");
        setIsEditingTitle(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-sm overflow-hidden border border-border-subtle group",
        aspectRatio,
        sizeClass
      )}
      onMouseEnter={() => isLongCaption && setShowFullCaption(true)}
      onMouseLeave={() => setShowFullCaption(false)}
    >
      {/* Image */}
      <Image
        src={image.imageUrl}
        alt={image.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />

      {/* Top title bar - editable on click */}
      <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {isEditingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSaveTitle)}
            onBlur={handleSaveTitle}
            className="w-full bg-background-input/90 border border-accent-gold rounded px-2 py-1 text-xs text-text-primary font-semibold"
            placeholder="Image name..."
            maxLength={50}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className="flex items-center gap-1 cursor-pointer group/title"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
          >
            <p className="text-white text-xs font-semibold truncate flex-1">
              {image.title}
            </p>
            <Pencil className="h-3 w-3 text-white/60 opacity-0 group-hover/title:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      {/* Hover overlay with actions */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white hover:text-accent-gold bg-black/30 hover:bg-black/50"
          onClick={() => setIsEditingCaption(true)}
          title="Edit caption"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-white hover:text-red-500 bg-black/30 hover:bg-red-500/20"
          onClick={onUnlink}
          disabled={isUnlinking}
          title="Unlink image"
        >
          {isUnlinking ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-sm animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Bottom caption bar */}
      {isEditingCaption ? (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-obsidian/95 backdrop-blur-sm">
          <input
            ref={captionInputRef}
            type="text"
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleSaveCaption)}
            onBlur={handleSaveCaption}
            className="w-full bg-background-input border border-accent-gold rounded px-2 py-1 text-xs text-text-primary placeholder:text-text-muted"
            placeholder="Add a caption..."
            maxLength={100}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : displayCaption ? (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-all cursor-pointer",
            "hover:from-black/95"
          )}
          onClick={() => setIsEditingCaption(true)}
        >
          <p
            className={cn(
              "text-white text-xs font-medium",
              !showFullCaption && isLongCaption && "truncate"
            )}
          >
            {displayCaption}
          </p>
        </div>
      ) : (
        <div
          className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:from-black/80"
          onClick={() => setIsEditingCaption(true)}
        >
          <p className="text-white/60 text-xs italic text-center">
            + Add caption
          </p>
        </div>
      )}

      {/* Caption indicator dot */}
      {image.caption && (
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-gold border border-black/30" />
      )}
    </div>
  );
}
