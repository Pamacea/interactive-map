"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Download, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { downloadImage } from "../utils/image-utils";
import type { GalleryItemWithRelations } from "@/types/gallery.type";

interface ImageLightboxProps {
  images: GalleryItemWithRelations[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLinkToPin?: (image: GalleryItemWithRelations) => void;
  onLinkToLore?: (image: GalleryItemWithRelations) => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onLinkToPin,
  onLinkToLore,
}: ImageLightboxProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-white hover:text-accent-gold transition-colors z-50"
        onClick={onClose}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Navigation buttons */}
      {hasPrevious && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-accent-gold transition-colors z-50"
          onClick={onPrevious}
        >
          <ChevronLeft className="w-12 h-12" />
        </button>
      )}

      {hasNext && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-accent-gold transition-colors z-50"
          onClick={onNext}
        >
          <ChevronRight className="w-12 h-12" />
        </button>
      )}

      {/* Image container */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] px-16 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={currentImage.imageUrl}
            alt={currentImage.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      {/* Info panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {currentImage.title}
              </h2>
              {currentImage.description && (
                <p className="text-white/80 text-sm">
                  {currentImage.description}
                </p>
              )}

              {/* Linked items */}
              <div className="flex gap-2 mt-3">
                {currentImage.pinId && (
                  <div className="bg-accent-gold text-background-base text-xs px-3 py-1 rounded-md font-medium flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Linked to Pin
                  </div>
                )}
                {currentImage.loreEntryId && (
                  <div className="bg-purple-600 text-white text-xs px-3 py-1 rounded-md font-medium flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Linked to Lore
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white/10"
                onClick={() => downloadImage(currentImage.imageUrl, currentImage.title)}
              >
                <Download className="w-4 h-4" />
              </Button>

              {onLinkToPin && !currentImage.pinId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white/10"
                  onClick={() => onLinkToPin(currentImage)}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Link to Pin
                </Button>
              )}

              {onLinkToLore && !currentImage.loreEntryId && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-white hover:bg-white/10"
                  onClick={() => onLinkToLore(currentImage)}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Link to Lore
                </Button>
              )}
            </div>
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="mt-4 text-center">
              <p className="text-white/60 text-sm">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
    </div>
  );
}
