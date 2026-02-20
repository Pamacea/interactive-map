import { FC } from "react";
import { PinPopup } from "@/features/pins/ui/pin-popup";
import { useDeletePinServer, usePinById } from "@/features/pins/store";
import { usePinScreenCoordinates } from "@/features/pins/logic/use-pin-screen-coordinates";
import { useToast } from "@/shared/hooks/use-toast";

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

  // CRITICAL: Call ALL hooks before any early returns to avoid "Rendered more hooks than during the previous render" error
  // If pin is null, we still need to call usePinScreenCoordinates with a dummy pin
  const coordinates = usePinScreenCoordinates({
    pin: pin ?? { id: selectedPinId, latitude: 0, longitude: 0 },
    imageDimensions,
    layers,
  });

  if (!pin) return null;

  const handleDelete = async () => {
    try {
      await deletePinServer(pin.id);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete pin. Please try again.";
      console.error("Failed to delete pin:", error);
      showToast(errorMessage, "error");
    }
  };

  const handleTitleChange = (_newTitle: string) => {
    // Title is already updated via optimistic update in PopupHeader
  };

  const handleDescriptionChange = (_newDescription: string) => {
    // Description is already updated via optimistic update
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
          onDescriptionChange={handleDescriptionChange}
        />
      </div>
    </div>
  );
};
