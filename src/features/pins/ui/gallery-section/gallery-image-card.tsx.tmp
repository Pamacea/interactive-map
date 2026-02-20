"use client";

import * as React from "react";
import Image from "next/image";
import { X, Pencil } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

type GalleryLayout = "grid-3" | "grid-2" | "vertical-1-2" | "horizontal-3";

interface GalleryImageCardProps {
  image: GalleryItemWithRelations & { caption?: string | null };
  onUnlink: () => void;
  isUnlinking: boolean;
  onCaptionUpdate: (caption: string) => void;
  onTitleUpdate: (title: string) => void;
  sizeClass?: string;
  layout: GalleryLayout;
}

/**
 * Gallery Image Card
 * Displays a single gallery image with edit actions
 */
export function GalleryImageCard({
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
