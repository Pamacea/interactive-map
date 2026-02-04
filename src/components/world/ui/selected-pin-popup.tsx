import { FC } from "react";
import { PinPopup } from "@/components/pins/ui/pin-popup";
import { useDeletePinServer, usePinById } from "@/stores/use-pins-store";
import { usePinScreenCoordinates } from "@/components/pins/logic/use-pin-screen-coordinates";
import { useToast } from "@/hooks/use-toast";

export interface SelectedPinPopupProps {
  selectedPinId: string;
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
  selectedPinId,
  onClose,
  imageDimensions,
  layers,
}) => {
  // Read pin from store to get real-time updates during drag
  const pin = usePinById(selectedPinId);
  const deletePinServer = useDeletePinServer();
  const { showToast } = useToast();

  if (!pin) return null;

  // Calculate popup position using the same logic as pins
  const coordinates = usePinScreenCoordinates({
    pin,
    imageDimensions,
    layers,
  });

  const handleDelete = async () => {
    try {
      await deletePinServer(pin.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete pin:", error);
      showToast(
        "Failed to delete pin. Please try again.",
        "error"
      );
    }
  };

  const handleTitleChange = (_newTitle: string) => {
    // Title is already updated via optimistic update in PopupHeader
  };

  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: `${coordinates.x}px`,
        top: `${coordinates.y}px`,
        transform: "translate(-50%, -100%) translateY(-12px)",
      }}
    >
      <div className="pointer-events-auto">
        <PinPopup
          pin={pin}
          onClose={onClose}
          onDelete={handleDelete}
          onTitleChange={handleTitleChange}
        />
      </div>
    </div>
  );
};
