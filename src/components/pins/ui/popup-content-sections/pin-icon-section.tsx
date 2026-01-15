/**
 * Pin icon section with icon picker trigger
 */

import * as React from "react"
import { MapPin, Pencil } from "lucide-react"
import { IconPicker } from "../icon-picker"
import type { Pin } from "@prisma/client"

interface PinIconSectionProps {
  pin: Pin
  isOpen: boolean
  onOpenPicker: () => void
  onClosePicker: () => void
  onSelectIcon: (iconName: string) => void
}

export function PinIconSection({
  pin,
  isOpen,
  onOpenPicker,
  onClosePicker,
  onSelectIcon,
}: PinIconSectionProps) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Icon
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenPicker()
            }}
            className="text-xs text-accent-gold hover:text-accent-gold/80 transition-colors flex items-center gap-1"
          >
            <Pencil className="h-3 w-3" />
            Change
          </button>
        </div>
        <div
          className="flex items-center justify-center gap-2 rounded-sm border border-border-ornate bg-[rgb(0_0_0/0.2)] p-4 cursor-pointer hover:border-accent-gold/50 transition-colors"
          onClick={() => onOpenPicker()}
        >
          <span className="text-4xl">
            {pin.icon?.startsWith("/") ? (
              <img src={pin.icon} alt="" className="w-8 h-8 object-contain" />
            ) : (
              <MapPin className="w-8 h-8 text-accent-gold" />
            )}
          </span>
          <span className="text-xs text-text-muted">
            {pin.icon && !pin.icon.startsWith("/") ? pin.icon : "Default"}
          </span>
        </div>
      </div>

      {/* Icon Picker Dialog */}
      {isOpen && (
        <IconPicker
          onSelect={onSelectIcon}
          onClose={onClosePicker}
          currentIcon={pin.icon || undefined}
        />
      )}
    </>
  )
}
