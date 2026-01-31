import { FC } from "react";
import { PinPopup } from "@/components/pins/ui/pin-popup";
import { useDeletePinServer } from "@/stores/use-pins-store";
import { usePinScreenCoordinates } from "@/components/pins/logic/use-pin-screen-coordinates";
import { useToast } from "@/hooks/use-toast";
import type { PinWithLayer } from "../logic/use-pins-filtering";

export interface SelectedPinPopupProps {
  selectedPin: PinWithLayer;
  onClose: () => void;
  /** Image dimensions for coordinate calculation */
  imageDimensions: { width: number; height: number };
  /** Available layers for offset calculation */
  layers: Array<{
    id: string;
    offsetX?: number;
    offsetY?: number;
    locked?: boolean;
  }>;
}

export const SelectedPinPopup: FC<SelectedPinPopupProps> = ({
  selectedPin,
  onClose,
  imageDimensions,
  layers,
}) => {
  const deletePinServer = useDeletePinServer();
  const { showToast } = useToast();

  // Calculate popup position using the same logic as pins
  const coordinates = usePinScreenCoordinates({
    pin: selectedPin,
    imageDimensions,
    layers,
  });

  const handleDelete = async () => {
    try {
      await deletePinServer(selectedPin.id);
      onClose(); // Close popup after successful delete
    } catch (error) {
      // Don't close popup on error - show error to user
      console.error("Failed to delete pin:", error);
      showToast(
        "Failed to delete pin. Please try again.",
        "error"
      );
    }
  };

  const handleTitleChange = (_newTitle: string) => {
    // Title is already updated via optimistic update in PopupHeader
    // This callback is for any additional handling if needed
  };

  // Popup is positioned using pixel coordinates (same as pins)
  // The transform centers it horizontally and positions it above the pin
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
        transform: "translate(-50%, -100%) translateY(-12px)",
      }}
    >
      {/* Re-enable pointer events for the actual popup content */}
      <div className="pointer-events-auto">
        <PinPopup
          pin={selectedPin}
          onClose={onClose}
          onDelete={handleDelete}
          onTitleChange={handleTitleChange}
        />
      </div>
    </div>
  );
};
