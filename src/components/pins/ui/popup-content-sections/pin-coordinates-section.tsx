/**
 * Pin coordinates section
 */

import { formatCoordinate } from "../../utils/pin-popup-utils"
import type { Pin } from "@prisma/client"

interface PinCoordinatesSectionProps {
  pin: Pin
}

export function PinCoordinatesSection({ pin }: PinCoordinatesSectionProps) {
  return (
    <div className="flex gap-4 text-xs text-text-secondary">
      <div>
        <span className="font-medium">Lat:</span> {formatCoordinate(pin.latitude)}
      </div>
      <div>
        <span className="font-medium">Lng:</span> {formatCoordinate(pin.longitude)}
      </div>
    </div>
  )
}
