"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Link2, FileImage, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

export interface ImageCardProps {
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

  // Null safety checks for gallery item properties
  const imageUrl = image?.imageUrl ?? "";
  const title = image?.title ?? "Untitled";
  const description = image?.description;
  const pinId = image?.pinId ?? image?.pin?.id ?? null;
  const loreEntryId = image?.loreEntryId ?? image?.loreEntry?.id ?? null;

  // Skip rendering if image data is invalid
  if (!image || !imageUrl) {
    return (
      <Card className={cn("aspect-square bg-background-card rounded-sm overflow-hidden", className)}>
        <CardContent className="p-0 h-full relative flex items-center justify-center bg-background-elevated">
          <FileImage className="w-12 h-12 text-text-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "group relative aspect-square bg-background-card rounded-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected && "ring-2 ring-accent-gold",
        className
      )}
      onClick={onSelect}
    >
      <CardContent className="p-0 h-full relative">
        {/* Image */}
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={title}
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
          <p className="text-white text-xs font-medium truncate">{title}</p>
          {description && (
            <p className="text-white/70 text-xs truncate">
              {description}
            </p>
          )}
        </div>

        {/* Linked indicators */}
        <div className="absolute top-2 left-2 flex gap-1">
          {pinId && (
            <Badge className="bg-accent-gold text-background-base hover:bg-accent-gold/80">
              Pin
            </Badge>
          )}
          {loreEntryId && (
            <Badge className="bg-purple-600 text-white hover:bg-purple-600/80">
              Lore
            </Badge>
          )}
        </div>

        {/* Action menu */}
        <div className="absolute top-2 right-2">
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:text-accent-gold"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}>
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onLinkToPin?.();
              }}>
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Link to Pin
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={(e) => {
                e.stopPropagation();
                onLinkToLore?.();
              }}>
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Link to Lore
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
                className="text-red-600 focus:text-red-600"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
