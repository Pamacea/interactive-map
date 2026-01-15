import { FC } from "react";
import React from "react";
import type { Pin } from "@prisma/client";
import { PinPopup } from "@/components/pins/ui/pin-popup";
import { usePinsStore } from "@/stores/use-pins-store";
import type { PinWithLayer } from "../logic/use-pins-filtering";

export interface SelectedPinPopupProps {
  selectedPin: PinWithLayer;
  onClose: () => void;
}

export const SelectedPinPopup: FC<SelectedPinPopupProps> = ({
  selectedPin,
  onClose,
}) => {
  const deletePinServer = usePinsStore((state) => state.deletePinServer);

  const handleDelete = async () => {
    try {
      await deletePinServer(selectedPin.id);
      onClose(); // Close popup after successful delete
    } catch (error) {
      console.error("Failed to delete pin:", error);
      throw error;
    }
  };

  const handleTitleChange = (newTitle: string) => {
    // Title is already updated via optimistic update in PopupHeader
    // This callback is for any additional handling if needed
  };

  return (
    <div
      className="absolute z-50"
      style={{
        // CRITICAL FIX: Use percentage-based positioning like pins
        // The parent container's transform (translate/scale) handles all panning/zooming
        // We DON'T add transform.translateX/Y here to avoid double-transformation
        left: `${selectedPin.longitude * 100}%`,
        top: `${selectedPin.latitude * 100}%`,
        // Center horizontally and position 24px above the pin
        transform: "translateX(-50%) translateY(-24px)",
      }}
    >
      <PinPopup
        pin={selectedPin}
        onClose={onClose}
        onDelete={handleDelete}
        onTitleChange={handleTitleChange}
      />
    </div>
  );
};
