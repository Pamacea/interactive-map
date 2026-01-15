/**
 * Pin properties section (RPG data display)
 */

import { formatPropertyValue } from "../../utils/pin-popup-utils"

interface PinPropertiesSectionProps {
  properties: Record<string, unknown>
}

export function PinPropertiesSection({ properties }: PinPropertiesSectionProps) {
  if (Object.keys(properties).length === 0) {
    return null
  }

  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Properties
      </h4>
      <div className="space-y-1 rounded-sm border border-border-ornate bg-[rgb(0_0_0/0.2)] p-3">
        {Object.entries(properties).map(([key, value]) => (
          <div
            key={key}
            className="flex items-start justify-between gap-2 text-sm"
          >
            <span className="font-medium text-text-secondary capitalize">
              {key}:
            </span>
            <span className="text-right font-semibold text-text-primary">
              {formatPropertyValue(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
