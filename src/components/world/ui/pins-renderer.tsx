import { FC, memo } from "react";
import type { Pin } from "@prisma/client";
import { PinMarker } from "@/components/pins/ui/pin-marker";
import type { Transform } from "../logic/use-map-pan";
import type { PinWithLayer } from "../logic/use-pins-filtering";

export interface PinsRendererProps {
  pins: PinWithLayer[];
  imageDimensions: { width: number; height: number };
  transform: Transform;
  onPinClick: (pin: PinWithLayer) => void;
}

export const PinsRenderer: FC<PinsRendererProps> = memo(
  ({ pins, imageDimensions, transform, onPinClick }) => {
    return (
      <>
        {pins.map((pin) => {
          return (
            <PinMarker
              key={pin.id}
              pin={pin}
              mapWidth={imageDimensions.width}
              mapHeight={imageDimensions.height}
              transform={transform}
              onPinClick={onPinClick}
            />
          );
        })}
      </>
    );
  }
);

PinsRenderer.displayName = "PinsRenderer";
