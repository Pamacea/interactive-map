import { FC, memo } from "react";
import type { Pin } from "@prisma/client";
import { MemoizedPinMarker } from "@/components/pins/ui/pin-marker";
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
            <MemoizedPinMarker
              key={pin.id}
              pin={pin}
              imageDimensions={imageDimensions}
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
