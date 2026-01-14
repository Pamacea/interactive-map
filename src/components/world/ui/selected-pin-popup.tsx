import { FC } from "react";
import type { Pin } from "@prisma/client";
import { PinPopup } from "@/components/pins/ui/pin-popup";
import type { PinWithLayer } from "../logic/use-pins-filtering";

export interface SelectedPinPopupProps {
  selectedPin: PinWithLayer;
  imageDimensions: { width: number; height: number };
  transform: { scale: number; translateX: number; translateY: number };
  onClose: () => void;
}

export const SelectedPinPopup: FC<SelectedPinPopupProps> = ({
  selectedPin,
  imageDimensions,
  transform,
  onClose,
}) => {
  const { width, height } = imageDimensions;

  return (
    <div
      className="absolute z-50"
      style={{
        left: `${selectedPin.longitude * width * transform.scale + transform.translateX}px`,
        top: `${selectedPin.latitude * height * transform.scale + transform.translateY}px`,
      }}
    >
      <PinPopup pin={selectedPin} onClose={onClose} position={{ x: 0, y: 0 }} />
    </div>
  );
};
