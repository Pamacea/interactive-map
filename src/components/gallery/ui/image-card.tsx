"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Link2, FileImage, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

interface ImageCardProps {
  image: GalleryItemWithRelations;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onLinkToPin?: () => void;
  onLinkToLore?: () => void;
  className?: string;
}

export function ImageCard({
  image,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onLinkToPin,
  onLinkToLore,
  className,
}: ImageCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className={cn(
        "group relative aspect-square bg-background-card rounded-sm border border-border-subtle overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected && "ring-2 ring-accent-gold",
        className
      )}
      onClick={onSelect}
    >
      {/* Image */}
      {!imageError ? (
        <Image
          src={image.imageUrl}
          alt={image.title}
          fill
          className="object-cover"
          onError={handleImageError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-background-elevated">
          <FileImage className="w-12 h-12 text-text-muted" />
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white text-xs font-medium truncate">{image.title}</p>
        {image.description && (
          <p className="text-white/70 text-xs truncate">
            {image.description}
          </p>
        )}
      </div>

      {/* Linked indicators */}
      <div className="absolute top-2 left-2 flex gap-1">
        {image.pinId && (
          <div className="bg-accent-gold text-background-base text-xs px-2 py-1 rounded-md font-medium">
            Pin
          </div>
        )}
        {image.loreEntryId && (
          <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded-md font-medium">
            Lore
          </div>
        )}
      </div>

      {/* Action menu */}
      <div className="absolute top-2 right-2">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:text-accent-gold"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-50 bg-background-card border border-border-subtle rounded-md shadow-lg py-1 min-w-[150px]">
              <button
                className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-background-card-hover hover:text-text-primary flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                  setShowMenu(false);
                }}
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>

              <button
                className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-background-card-hover hover:text-text-primary flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkToPin?.();
                  setShowMenu(false);
                }}
              >
                <Link2 className="w-4 h-4" />
                Link to Pin
              </button>

              <button
                className="w-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-background-card-hover hover:text-text-primary flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onLinkToLore?.();
                  setShowMenu(false);
                }}
              >
                <FileImage className="w-4 h-4" />
                Link to Lore
              </button>

              <div className="border-t border-border-subtle my-1" />

              <button
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-background-card-hover flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                  setShowMenu(false);
                }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
