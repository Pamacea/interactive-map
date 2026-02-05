"use client";

import * as React from "react";
import { X, Trash2, MapPin, Edit3, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pin } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { stopPropagation } from "@/lib/event-manager";
import { getPinEmoji } from "../utils/pin-popup-utils";
import { useFocusReturn } from "@/hooks/accessibility";
import { useEventCapture } from "@/hooks/use-event-capture";

interface PinPopupProps {
  pin: Pin;
  _worldId?: string;
  onClose?: () => void;
  onDelete?: () => void;
  onTitleChange?: (newTitle: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
  _onIconChange?: (newIcon: string) => void;
}

export type { PinPopupProps };

export function PinPopup({
  pin,
  _worldId,
  onClose,
  onDelete,
  onTitleChange,
  onDescriptionChange,
  _onIconChange,
}: PinPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null);

  useEventCapture({
    scope: "popup",
    onEscape: onClose,
  });

  useFocusReturn(true);

  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(pin.title);
  const titleInputRef = React.useRef<HTMLInputElement>(null);

  const [isEditingDesc, setIsEditingDesc] = React.useState(false);
  const [editedDesc, setEditedDesc] = React.useState(pin.description || "");

  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const config = pinTypeConfig[pin.pinType as PinType];

  React.useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== pin.title) {
      onTitleChange?.(editedTitle.trim());
    } else {
      setEditedTitle(pin.title);
    }
    setIsEditingTitle(false);
  };

  const handleSaveDescription = () => {
    if (editedDesc !== pin.description) {
      onDescriptionChange?.(editedDesc);
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
    <>
      <div
        ref={popupRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pin-popup-title"
        className={cn(
          "relative z-50 w-80 rounded-sm overflow-hidden",
          "bg-gradient-to-b from-stone to-obsidian",
          "border border-accent-gold/30 shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200",
          "font-display"
        )}
        onClick={stopPropagation}
        onMouseUp={stopPropagation}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full" style={{ backgroundColor: config.color }} />

        {/* Header with compact actions */}
        <div className="flex items-start justify-between p-4 border-b border-border-subtle">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Pin type indicator */}
            <div
              className="flex h-9 w-9 items-center justify-center rounded-sm flex-shrink-0 ring-1 ring-inset ring-white/10"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <span className="text-base">
                {getPinEmoji(pin.pinType as PinType)}
              </span>
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
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 bg-transparent text-lg font-semibold text-text-primary border-b-2 border-accent-gold outline-none -ml-1 px-1"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveTitle();
                    }}
                    className="h-6 w-6 text-green-500 hover:text-green-400"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div
                  className="group cursor-pointer py-0.5 -ml-1 px-1 rounded hover:bg-white/5 transition-colors"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h3
                    id="pin-popup-title"
                    className="text-lg font-semibold text-text-primary truncate"
                  >
                    {pin.title}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-wider mt-0.5" style={{ color: config.color }}>
                    {config.label}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0 -mr-1">
            {onDelete && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 text-text-muted hover:text-red-500 hover:bg-red-500/10"
                aria-label="Delete pin"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 text-text-muted hover:text-accent-gold hover:bg-accent-gold/10"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Description */}
          <div>
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
                  onClick={(e) => e.stopPropagation()}
                  className="w-full min-h-20 px-3 py-2 bg-background-input border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none resize-y"
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
                className="group relative rounded-sm p-3 -m-3 cursor-pointer border border-transparent hover:border-border-subtle hover:bg-white/5 transition-all"
                onClick={() => setIsEditingDesc(true)}
              >
                {pin.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {pin.description}
                  </p>
                ) : (
                  <p className="text-sm text-text-muted italic">
                    Add a description...
                  </p>
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 className="h-3.5 w-3.5 text-accent-gold" />
                </div>
              </div>
            )}
          </div>

          {/* Icon preview */}
          <div className="flex items-center justify-between p-3 rounded-sm bg-black/20 border border-border-subtle">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent-gold" />
              <span className="text-sm text-text-secondary">Pin Icon</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{pin.icon || "📍"}</span>
            </div>
          </div>

          {/* Properties */}
          {Object.keys(properties).length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                Properties
              </h4>
              <div className="space-y-1 rounded-sm bg-black/20 p-2">
                {Object.entries(properties).slice(0, 4).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between gap-3 text-sm py-1 px-2 rounded hover:bg-white/5"
                  >
                    <span className="text-text-muted capitalize text-xs">
                      {key}
                    </span>
                    <span className="text-text-primary text-xs font-medium">
                      {String(value)}
                    </span>
                  </div>
                ))}
                {Object.keys(properties).length > 4 && (
                  <div className="text-xs text-text-muted text-center py-1 text-accent-gold/60">
                    +{Object.keys(properties).length - 4} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coordinates */}
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <div className="text-xs text-text-muted">
              <span className="font-mono">{pin.latitude.toFixed(4)}</span>
              <span className="mx-1">•</span>
              <span className="font-mono">{pin.longitude.toFixed(4)}</span>
            </div>
            <span className="text-xs text-text-muted">
              {pin.isVisible ? "Visible" : "Hidden"}
            </span>
          </div>
        </div>

        {/* Bottom accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteDialog && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(false);
          }}
        >
          <div
            className="bg-obsidian border border-red-500/30 rounded-sm p-6 shadow-2xl max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-text-primary mb-2">Delete Pin?</h3>
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
                  onDelete?.();
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
    </>
  );
}
