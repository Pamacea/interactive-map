"use client";

import * as React from "react";
import { X, MapPin } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { linkGalleryItemToPin } from "@/features/gallery/actions";
import type { GalleryItemWithRelations } from "@/types/gallery.type";
import type { Pin } from "@/types/world.type";

interface LinkToPinDialogProps {
  image: GalleryItemWithRelations;
  pins: Pin[];
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LinkToPinDialog({
  image,
  pins,
  open,
  onClose,
  onSuccess,
}: LinkToPinDialogProps) {
  const [search, setSearch] = React.useState("");
  const [selectedPinId, setSelectedPinId] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Filter out already linked pin
  const availablePins = React.useMemo(() => {
    return pins.filter((pin) => pin.id !== image.pinId);
  }, [pins, image.pinId]);

  const filteredPins = React.useMemo(() => {
    if (!search) return availablePins;
    return availablePins.filter((pin) =>
      pin.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [availablePins, search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPinId) return;

    setIsSubmitting(true);

    try {
      await linkGalleryItemToPin(image.id, selectedPinId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to link to pin:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-sm bg-obsidian border border-iron shadow-xl p-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Link to Pin</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Image preview */}
        {image.imageUrl && (
          <div className="mb-4 rounded-sm overflow-hidden border border-border-subtle">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-24 object-cover"
            />
          </div>
        )}

        {/* Search */}
        <div className="mb-4">
          <Label htmlFor="pin-search">Search Pins</Label>
          <Input
            id="pin-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
          />
        </div>

        {/* Pins list */}
        <div className="flex-1 overflow-y-auto border border-border-subtle rounded-sm mb-4">
          {filteredPins.length === 0 ? (
            <div className="p-4 text-center text-text-muted text-sm">
              {search ? "No pins found" : "No pins available"}
            </div>
          ) : (
            <div className="divide-y divide-border-subtle">
              {filteredPins.map((pin) => (
                <button
                  key={pin.id}
                  type="button"
                  onClick={() => setSelectedPinId(pin.id)}
                  className={`w-full p-3 text-left hover:bg-white/5 transition-colors flex items-start gap-3 ${
                    selectedPinId === pin.id ? "bg-accent-gold/10" : ""
                  }`}
                >
                  <MapPin className="h-4 w-4 mt-0.5 text-accent-gold flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {pin.title}
                    </p>
                    {pin.description && (
                      <p className="text-xs text-text-secondary truncate">
                        {pin.description}
                      </p>
                    )}
                  </div>
                  {selectedPinId === pin.id && (
                    <span className="text-accent-gold text-sm">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPinId || isSubmitting}
            className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
          >
            {isSubmitting ? "Linking..." : "Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
