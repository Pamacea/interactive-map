import { FC } from "react";
import React from "react";
import type { Pin } from "@prisma/client";
import { PinPopup } from "@/components/pins/ui/pin-popup";
import { usePinsStore } from "@/stores/use-pins-store";
import type { PinWithLayer } from "../logic/use-pins-filtering";

export interface SelectedPinPopupProps {
  selectedPin: PinWithLayer;
  onClose: () => void;
  imageDimensions: { width: number; height: number };
  transform: { translateX: number; translateY: number; scale: number };
}

export const SelectedPinPopup: FC<SelectedPinPopupProps> = ({
  selectedPin,
  onClose,
  imageDimensions,
  transform,
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

  // Calculate screen position from pin coordinates (percentage)
  // Taking into account pan (translateX/Y) and zoom (scale)
  const pinX = selectedPin.longitude * imageDimensions.width;
  const pinY = selectedPin.latitude * imageDimensions.height;

  // Apply transformations: (pinCoord * scale) + translate
  const screenX = pinX * transform.scale + transform.translateX;
  const screenY = pinY * transform.scale + transform.translateY;

  return (
    <div
      className="fixed z-50"
      style={{
        // Position at the calculated screen coordinates
        left: `${screenX}px`,
        top: `${screenY}px`,
        // Center horizontally and position 24px above the pin
        transform: "translateX(-50%) translateY(-100%) translateY(-24px)",
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
