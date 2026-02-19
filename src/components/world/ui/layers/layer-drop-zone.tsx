/**
 * Layer Drop Zone - Drag & drop zone for moving items between layers
 * @module layers/layer-drop-zone
 */

"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Layers } from "lucide-react";

export type DraggableItemType = "pin" | "image" | "region";

export interface DraggableItem {
  id: string;
  type: DraggableItemType;
  name: string;
  // Additional data based on type
  pinType?: string;
  imageUrl?: string;
  regionType?: string;
  color?: string;
}

interface LayerDropZoneProps {
  layerId: string;
  layerName: string;
  layerType?: string;
  isLocked?: boolean;
  isBaseMap?: boolean;
  acceptedTypes?: DraggableItemType[];
  onItemDropped: (itemId: string, itemType: DraggableItemType, targetLayerId: string) => Promise<void>;
  onToggleVisibility?: () => void;
  onToggleLock?: () => void;
  onDelete?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function LayerDropZone({
  layerId,
  layerName,
  layerType = "CUSTOM",
  isLocked = false,
  isBaseMap = false,
  acceptedTypes = ["pin", "image", "region"],
  onItemDropped,
  onToggleVisibility,
  onToggleLock,
  onDelete,
  className,
  children,
}: LayerDropZoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isLocked || isBaseMap) return;
    setIsDraggingOver(true);
  }, [isLocked, isBaseMap]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    if (isLocked || isBaseMap) return;

    const data = e.dataTransfer.getData("application/json");
    if (!data) return;

    try {
      const item: DraggableItem = JSON.parse(data);

      // Check if this item type is accepted
      if (acceptedTypes && !acceptedTypes.includes(item.type)) {
        console.warn(`Item type ${item.type} not accepted by this layer`);
        return;
      }

      setIsProcessing(true);
      await onItemDropped(item.id, item.type, layerId);
    } catch (error) {
      console.error("Failed to parse drop data:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isLocked, isBaseMap, acceptedTypes, layerId, onItemDropped]);

  const handleDragStart = useCallback((e: React.DragEvent, item: DraggableItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  }, []);

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        isDraggingOver && !isLocked && !isBaseMap && "ring-2 ring-accent-gold/50 ring-offset-1 ring-offset-obsidian",
        isProcessing && "opacity-50 pointer-events-none",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator */}
      {isDraggingOver && !isLocked && !isBaseMap && (
        <div className="absolute inset-0 bg-accent-gold/10 rounded-sm pointer-events-none flex items-center justify-center">
          <div className="bg-accent-gold text-void px-3 py-1.5 rounded-sm text-sm font-display flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Drop to move to "{layerName}"
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

/**
 * Draggable Item Wrapper - Makes an item draggable
 */
interface DraggableItemWrapperProps {
  item: DraggableItem;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function DraggableItemWrapper({ item, children, className, disabled = false }: DraggableItemWrapperProps) {
  const handleDragStart = useCallback((e: React.DragEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  }, [item, disabled]);

  return (
    <div
      draggable={!disabled}
      onDragStart={handleDragStart}
      className={cn(
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "cursor-grab active:cursor-grabbing",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Layer Content with Drag Support - Wraps content items to make them draggable
 */
interface LayerContentWithDragProps {
  layerId: string;
  items: DraggableItem[];
  onRemoveItem?: (itemId: string) => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export function LayerContentWithDrag({
  layerId,
  items,
  onRemoveItem,
  onItemClick,
  className,
}: LayerContentWithDragProps) {
  if (items.length === 0) {
    return (
      <div className={cn("px-3 py-4 text-center", className)}>
        <p className="text-sm text-bone-dark/50 font-fell">
          Drag items here to add to this layer
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {items.map((item) => (
        <DraggableItemWrapper key={item.id} item={item}>
          <div
            onClick={() => onItemClick?.(item.id)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-iron/30 cursor-grab active:cursor-grabbing group"
          >
            {/* Icon based on type */}
            {item.type === "pin" && <MapPinIcon />}
            {item.type === "image" && <ImageIcon imageUrl={item.imageUrl} />}
            {item.type === "region" && <RegionIcon color={item.color} />}

            {/* Name */}
            <span className="flex-1 text-sm text-bone-dark truncate font-fell">
              {item.name}
            </span>

            {/* Remove button */}
            {onRemoveItem && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
              >
                <Plus className="w-3 h-3 rotate-45" />
              </button>
            )}
          </div>
        </DraggableItemWrapper>
      ))}
    </div>
  );
}

function MapPinIcon() {
  return (
    <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function ImageIcon({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="w-6 h-6 rounded-sm overflow-hidden bg-iron/50 flex-shrink-0">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-3 h-3 text-bone-dark/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

function RegionIcon({ color }: { color?: string }) {
  return (
    <svg
      className="w-3 h-3"
      style={{ color: color || "#3b82f6" }}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}
