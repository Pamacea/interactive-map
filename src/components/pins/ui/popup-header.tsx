/**
 * Popup header component
 * Displays pin icon, editable title, type, and action buttons (close and delete)
 */

import * as React from "react";
import { X, Check, X as XIcon, Trash2, AlertTriangle } from "lucide-react";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";
import { getPinEmoji } from "../utils/pin-popup-utils";
import type { Pin } from "@prisma/client";
import { useUpdatePinServer, useUpdatePin } from "@/stores/use-pins-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PopupHeaderProps {
  pin: Pin;
  onClose?: () => void;
  onDelete?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

export function PopupHeader({ pin, onClose, onDelete, onTitleChange }: PopupHeaderProps) {
  const pinConfig = pinTypeConfig[pin.pinType as PinType];
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState(pin.title);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const updatePinServer = useUpdatePinServer();
  const updatePin = useUpdatePin();

  // Keep local state in sync with pin prop when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setEditedTitle(pin.title);
    }
  }, [pin.title, isEditing]);

  // Start editing mode
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedTitle(pin.title);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(pin.title);
  };

  // Save title
  const handleSaveEdit = async () => {
    if (!editedTitle.trim()) {
      handleCancelEdit();
      return;
    }

    const newTitle = editedTitle.trim();

    // Optimistic update - update local state immediately
    updatePin(pin.id, { title: newTitle });
    setIsEditing(false);
    onTitleChange?.(newTitle);

    // Server sync in background
    try {
      await updatePinServer({ id: pin.id, title: newTitle });
    } catch (error) {
      console.error("Failed to update pin title:", error);
      // Revert on error - store will handle rollback
      setEditedTitle(pin.title);
    }
  };

  // Focus input when editing starts
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle Enter key to save, Escape to cancel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // Handle delete with confirmation dialog
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete?.();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete pin:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-ornate)] bg-[rgb(212_175_55/0.05)] p-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Type Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-sm flex-shrink-0"
          style={{
            backgroundColor: `${pinConfig.color}20`,
            border: `2px solid ${pinConfig.color}`,
          }}
        >
          <span className="text-lg" style={{ color: pinConfig.color }}>
            {getPinEmoji(pin.pinType as PinType)}
          </span>
        </div>

        {/* Title and Type - Editable */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Input
                ref={inputRef}
                type="text"
                value={editedTitle}
                onChange={(e) => {
                  e.stopPropagation();
                  setEditedTitle(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1 text-lg font-semibold"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSaveEdit();
                }}
                className="flex-shrink-0 text-green-600 hover:text-green-700"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelEdit();
                }}
                className="flex-shrink-0 text-red-600 hover:text-red-700"
                title="Cancel"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="group cursor-pointer"
              onClick={handleStartEdit}
              title="Click to edit title"
            >
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] group-hover:text-accent-gold transition-colors">
                {pin.title}
              </h3>
              <p
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: pinConfig.color }}
              >
                {pinConfig.label}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
        {/* Delete Button */}
        {onDelete && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowDeleteDialog(true)}
            className="text-text-muted hover:text-red-600"
            aria-label="Delete pin"
            title="Delete pin"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}

        {/* Close Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="text-text-muted hover:text-accent-gold"
          aria-label="Close popup"
          title="Close popup"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      {onDelete && (
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Delete Pin?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this pin? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
