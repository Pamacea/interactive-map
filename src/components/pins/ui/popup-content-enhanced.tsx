/**
 * Enhanced popup content component (orchestrator)
 * Composes atomic sub-components for pin popup display
 */

import type { Pin } from "@prisma/client"
import { usePopupDescription } from "../logic/use-popup-description"
import { usePopupIcon } from "../logic/use-popup-icon"
import {
  PinDescriptionSection,
  PinIconSection,
  PinPropertiesSection,
  PinCoordinatesSection,
} from "./popup-content-sections"

interface PopupContentEnhancedProps {
  pin: Pin
}

export function PopupContentEnhanced({ pin }: PopupContentEnhancedProps) {
  const properties = (pin.properties as Record<string, unknown>) || {}

  // Description editing logic
  const description = usePopupDescription(pin)

  // Icon selection logic
  const icon = usePopupIcon(pin)

  return (
    <div className="space-y-4 p-4">
      {/* Description Section */}
      <PinDescriptionSection
        pin={pin}
        isEditing={description.isEditing}
        editedDesc={description.editedDesc}
        textareaRef={description.textareaRef}
        onStartEditing={description.startEditing}
        onSave={description.handleSave}
        onCancel={description.handleCancel}
        onKeyDown={description.handleKeyDown}
        onDescChange={description.setEditedDesc}
      />

      {/* Icon Section */}
      <PinIconSection
        pin={pin}
        isOpen={icon.isOpen}
        onOpenPicker={icon.openPicker}
        onClosePicker={icon.closePicker}
        onSelectIcon={icon.handleSelect}
      />

      {/* Properties Section */}
      <PinPropertiesSection properties={properties} />

      {/* Coordinates Section */}
      <PinCoordinatesSection pin={pin} />
    </div>
  )
}
