"use client";

import * as React from "react";
import { MapPin, Edit3, Check, Trash2, Eye, EyeOff, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pin } from "@/types/pin.type";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { Button } from "@/components/ui/button";
import { getPinEmoji } from "../utils/pin-popup-utils";
import { PinGallerySection } from "./pin-gallery-section";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import { useQuery } from "@tanstack/react-query";

interface PinDetailsContentProps {
  pin: Pin;
  layerName?: string;
  onTitleChange: (newTitle: string) => void;
  onDescriptionChange: (newDescription: string) => void;
  onDelete: () => void;
  onToggleVisibility?: () => void;
  worldId?: string;
}

export function PinDetailsContent({
  pin,
  layerName,
  onTitleChange,
  onDescriptionChange,
  onDelete,
  onToggleVisibility,
  worldId,
}: PinDetailsContentProps) {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(pin.title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [editedDesc, setEditedDesc] = React.useState(pin.description || "");

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  // Fetch gallery images linked to this pin
  const { data: linkedImages = [], refetch: refetchImages } = useQuery({
    queryKey: ["pin-gallery", pin.id],
    queryFn: async () => {
      const { getGalleryItemsByPin } = await import("@/actions/gallery");
      return getGalleryItemsByPin(pin.id) as Promise<GalleryItemWithRelations[]>;
    },
    enabled: !!pin.id,
  });

  const config = pinTypeConfig[pin.pinType as PinType] || pinTypeConfig.CUSTOM;

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== pin.title) {
      onTitleChange(editedTitle.trim());
    } else {
      setEditedTitle(pin.title);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (editedDesc !== pin.description) {
      onDescriptionChange(editedDesc);
    }
    setIsEditingDesc(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    } else if (e.key === "Escape") {
      if (isEditingTitle) {
        setEditedTitle(pin.title);
        setIsEditingTitle(false);
      } else {
        setEditedDesc(pin.description || "");
        setIsEditingDesc(false);
      }
    }
  };

  const properties = (pin.properties as Record<string, unknown>) || {};

  return (
    <div className="p-4 space-y-4">
      {/* Header with pin type and title */}
      <div className="flex items-start gap-3">
        {/* Pin type indicator */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-sm flex-shrink-0 ring-1 ring-inset ring-white/10"
          style={{ backgroundColor: `${config.color}15` }}
        >
          <span className="text-xl">{getPinEmoji(pin.pinType as PinType)}</span>
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                ref={titleInputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, handleSaveTitle)}
                className="flex-1 bg-transparent text-lg font-semibold text-text-primary border-b-2 border-accent-gold outline-none px-1 py-0.5"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={handleSaveTitle}
                className="h-6 w-6 text-green-500 hover:text-green-400"
              >
                <Check className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div
              className="group cursor-pointer py-0.5 px-1 rounded hover:bg-white/5 transition-colors -ml-1"
              onClick={() => setIsEditingTitle(true)}
            >
              <h3 className="text-lg font-semibold text-text-primary truncate">
                {pin.title}
              </h3>
              <p
                className="text-xs font-medium uppercase tracking-wider mt-0.5"
                style={{ color: config.color }}
              >
                {config.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Description
          </h4>
          {!isEditingDesc && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingDesc(true)}
              className="h-6 px-2 text-xs text-accent-gold hover:text-accent-gold/80"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
        {isEditingDesc ? (
          <div className="space-y-2">
            <textarea
              value={editedDesc}
              onChange={(e) => setEditedDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setEditedDesc(pin.description || "");
                  setIsEditingDesc(false);
                }
              }}
              className="w-full min-h-24 px-3 py-2 bg-background-input border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none resize-y"
              placeholder="Add a description..."
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditedDesc(pin.description || "");
                  setIsEditingDesc(false);
                }}
                className="h-7 text-xs text-text-muted"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveDescription}
                className="h-7 text-xs bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "rounded-sm p-3 -m-3 cursor-pointer border border-transparent hover:border-border-subtle hover:bg-white/5 transition-all min-h-16",
              !pin.description && "text-text-muted italic"
            )}
            onClick={() => setIsEditingDesc(true)}
          >
            {pin.description ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                {pin.description}
              </p>
            ) : (
              <p className="text-sm">Add a description...</p>
            )}
          </div>
        )}
      </div>

      {/* Gallery Images */}
      {worldId && (
        <PinGallerySection
          pinId={pin.id}
          worldId={worldId}
          linkedImages={linkedImages}
          onImageLinked={() => refetchImages()}
          onImageUnlinked={() => refetchImages()}
        />
      )}

      {/* Pin Details */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Details
        </h4>

        {/* Icon */}
        <div className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent-gold" />
            <span className="text-sm text-text-secondary">Icon</span>
          </div>
          <span className="text-2xl">{pin.icon || "📍"}</span>
        </div>

        {/* Color */}
        <div className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle">
          <span className="text-sm text-text-secondary">Color</span>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm ring-1 ring-inset ring-white/20"
              style={{ backgroundColor: pin.color }}
            />
            <span className="text-xs font-mono text-text-muted">{pin.color}</span>
          </div>
        </div>

        {/* Layer */}
        {layerName && (
          <div className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent-gold" />
              <span className="text-sm text-text-secondary">Layer</span>
            </div>
            <span className="text-sm text-text-primary">{layerName}</span>
          </div>
        )}

        {/* Visibility */}
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="w-full flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              {pin.isVisible ? (
                <Eye className="h-4 w-4 text-green-500" />
              ) : (
                <EyeOff className="h-4 w-4 text-text-muted" />
              )}
              <span className="text-sm text-text-secondary">Visibility</span>
            </div>
            <span className="text-xs text-text-muted">
              {pin.isVisible ? "Visible" : "Hidden"}
            </span>
          </button>
        )}
      </div>

      {/* Properties */}
      {Object.keys(properties).length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
            Properties
          </h4>
          <div className="space-y-1 rounded-sm bg-black/20 p-2">
            {Object.entries(properties).slice(0, 6).map(([key, value]) => (
              <div
                key={key}
                className="flex items-start justify-between gap-3 text-sm py-1 px-2 rounded hover:bg-white/5"
              >
                <span className="text-text-muted capitalize text-xs">{key}</span>
                <span className="text-text-primary text-xs font-medium text-right">
                  {String(value)}
                </span>
              </div>
            ))}
            {Object.keys(properties).length > 6 && (
              <div className="text-xs text-text-muted text-center py-1 text-accent-gold/60">
                +{Object.keys(properties).length - 6} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Coordinates */}
      <div className="pt-2 border-t border-border-subtle">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
          Coordinates
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-sm bg-black/20 border border-border-subtle text-center">
            <div className="text-xs text-text-muted mb-1">Latitude</div>
            <div className="text-sm font-mono text-text-primary">
              {pin.latitude.toFixed(4)}
            </div>
          </div>
          <div className="p-2 rounded-sm bg-black/20 border border-border-subtle text-center">
            <div className="text-xs text-text-muted mb-1">Longitude</div>
            <div className="text-sm font-mono text-text-primary">
              {pin.longitude.toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-border-subtle">
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="w-full bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/30"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Pin
        </Button>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div
            className="bg-obsidian border border-red-500/30 rounded-sm p-6 shadow-2xl max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              Delete Pin?
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setShowDeleteDialog(false)}
                className="text-text-muted"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete();
                  setShowDeleteDialog(false);
                }}
                className="bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/30"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
