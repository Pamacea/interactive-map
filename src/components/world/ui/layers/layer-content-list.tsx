/**
 * Layer Content List - Shows items within a layer (pins, images, regions)
 * @module layers/layer-content-list
 */

"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Image, Square, Trash2, Edit2 } from "lucide-react";
import type { Pin } from "@prisma/client";

interface LayerPin {
  id: string;
  title: string;
  pinType: string;
  latitude: number;
  longitude: number;
  isVisible: boolean;
}

interface LayerImage {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
}

interface LayerRegion {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
}

interface LayerContent {
  pins: LayerPin[];
  images: LayerImage[];
  regions: LayerRegion[];
}

interface LayerContentListProps {
  layerId: string;
  layerName: string;
  content: LayerContent;
  onPinClick?: (pinId: string) => void;
  onImageClick?: (imageId: string) => void;
  onRegionClick?: (regionId: string) => void;
  onPinDelete?: (pinId: string) => void;
  onImageDelete?: (imageId: string) => void;
  onRegionDelete?: (regionId: string) => void;
  onMoveToLayer?: (itemId: string, itemType: "pin" | "image" | "region", targetLayerId: string) => void;
  className?: string;
}

export function LayerContentList({
  layerId,
  layerName,
  content,
  onPinClick,
  onImageClick,
  onRegionClick,
  onPinDelete,
  onImageDelete,
  onRegionDelete,
  onMoveToLayer,
  className,
}: LayerContentListProps) {
  const { pins, images, regions } = content;
  const hasContent = pins.length > 0 || images.length > 0 || regions.length > 0;

  const handlePinClick = useCallback((pinId: string) => {
    onPinClick?.(pinId);
  }, [onPinClick]);

  const handleImageClick = useCallback((imageId: string) => {
    onImageClick?.(imageId);
  }, [onImageClick]);

  const handleRegionClick = useCallback((regionId: string) => {
    onRegionClick?.(regionId);
  }, [onRegionClick]);

  if (!hasContent) {
    return (
      <div className={cn("px-3 py-4 text-center", className)}>
        <p className="text-sm text-bone-dark/50 font-fell">
          No items in this layer
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {/* Pins Section */}
      {pins.length > 0 && (
        <div className="px-3 py-1">
          <div className="text-xs text-bone-dark/50 font-display tracking-wide uppercase mb-1">
            Pins ({pins.length})
          </div>
          <div className="space-y-0.5">
            {pins.map((pin) => (
              <LayerPinItem
                key={pin.id}
                pin={pin}
                onClick={() => handlePinClick(pin.id)}
                onDelete={onPinDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}
      {images.length > 0 && (
        <div className="px-3 py-1 border-t border-iron/20 mt-1 pt-2">
          <div className="text-xs text-bone-dark/50 font-display tracking-wide uppercase mb-1">
            Images ({images.length})
          </div>
          <div className="space-y-0.5">
            {images.map((image) => (
              <LayerImageItem
                key={image.id}
                image={image}
                onClick={() => handleImageClick(image.id)}
                onDelete={onImageDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regions Section */}
      {regions.length > 0 && (
        <div className="px-3 py-1 border-t border-iron/20 mt-1 pt-2">
          <div className="text-xs text-bone-dark/50 font-display tracking-wide uppercase mb-1">
            Regions ({regions.length})
          </div>
          <div className="space-y-0.5">
            {regions.map((region) => (
              <LayerRegionItem
                key={region.id}
                region={region}
                onClick={() => handleRegionClick(region.id)}
                onDelete={onRegionDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface LayerPinItemProps {
  pin: LayerPin;
  onClick: () => void;
  onDelete?: (pinId: string) => void;
}

function LayerPinItem({ pin, onClick, onDelete }: LayerPinItemProps) {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(pin.id);
  }, [onDelete, pin.id]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-sm",
        "hover:bg-iron/30 cursor-pointer group",
        !pin.isVisible && "opacity-50"
      )}
      onClick={onClick}
    >
      <MapPin className="w-3 h-3 text-amber-500 flex-shrink-0" />
      <span className="flex-1 text-sm text-bone-dark truncate font-fell">
        {pin.title}
      </span>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

interface LayerImageItemProps {
  image: LayerImage;
  onClick: () => void;
  onDelete?: (imageId: string) => void;
}

function LayerImageItem({ image, onClick, onDelete }: LayerImageItemProps) {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(image.id);
  }, [onDelete, image.id]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-sm",
        "hover:bg-iron/30 cursor-pointer group"
      )}
      onClick={onClick}
    >
      <div className="w-6 h-6 rounded-sm overflow-hidden flex-shrink-0 bg-iron/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.imageUrl}
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="flex-1 text-sm text-bone-dark truncate font-fell">
        {image.title}
      </span>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

interface LayerRegionItemProps {
  region: LayerRegion;
  onClick: () => void;
  onDelete?: (regionId: string) => void;
}

function LayerRegionItem({ region, onClick, onDelete }: LayerRegionItemProps) {
  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(region.id);
  }, [onDelete, region.id]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-sm",
        "hover:bg-iron/30 cursor-pointer group",
        !region.visible && "opacity-50"
      )}
      onClick={onClick}
      style={{ borderLeftColor: region.color }}
    >
      <Square className="w-3 h-3 flex-shrink-0" style={{ color: region.color }} />
      <span className="flex-1 text-sm text-bone-dark truncate font-fell">
        {region.name}
      </span>
      <span className="text-xs text-bone-dark/50 font-mono">
        {region.type}
      </span>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
