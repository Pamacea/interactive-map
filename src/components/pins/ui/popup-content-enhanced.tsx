/**
 * Enhanced popup content component
 * Displays editable description, properties, icon picker, and coordinates
 */

import * as React from "react"
import { MapPin, Pencil, Check, X as XIcon } from "lucide-react"
import { formatPropertyValue, formatCoordinate } from "../utils/pin-popup-utils"
import { IconPicker } from "./icon-picker"
import { usePinsStore } from "@/stores/use-pins-store"
import type { Pin } from "@prisma/client"

interface PopupContentEnhancedProps {
  pin: Pin
}

export function PopupContentEnhanced({ pin }: PopupContentEnhancedProps) {
  const properties = (pin.properties as Record<string, unknown>) || {}
  const [isEditingDesc, setIsEditingDesc] = React.useState(false)
  const [editedDesc, setEditedDesc] = React.useState(pin.description || "")
  const [showIconPicker, setShowIconPicker] = React.useState(false)
  const descTextareaRef = React.useRef<HTMLTextAreaElement>(null)

  const updatePinServer = usePinsStore((state) => state.updatePinServer)
  const updatePin = usePinsStore((state) => state.updatePin)

  // Keep local state in sync with pin prop when not editing
  React.useEffect(() => {
    if (!isEditingDesc) {
      setEditedDesc(pin.description || "")
    }
  }, [pin.description, isEditingDesc])

  const handleSaveDesc = async () => {
    const newDesc = editedDesc.trim()

    // Optimistic update
    updatePin(pin.id, { description: newDesc })
    setIsEditingDesc(false)

    // Server sync
    try {
      await updatePinServer({ id: pin.id, description: newDesc })
    } catch (error) {
      console.error("Failed to update pin description:", error)
    }
  }

  const handleCancelDesc = () => {
    setIsEditingDesc(false)
    setEditedDesc(pin.description || "")
  }

  const handleKeyDownDesc = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleSaveDesc()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancelDesc()
    }
  }

  const handleSelectIcon = async (iconName: string) => {
    // Optimistic update
    updatePin(pin.id, { icon: iconName })

    // Server sync
    try {
      await updatePinServer({ id: pin.id, icon: iconName })
    } catch (error) {
      console.error("Failed to update pin icon:", error)
    }
  }

  // Focus textarea when editing starts
  React.useEffect(() => {
    if (isEditingDesc && descTextareaRef.current) {
      descTextareaRef.current.focus()
    }
  }, [isEditingDesc])

  return (
    <>
      <div className="space-y-4 p-4">
        {/* Description */}
        <div>
          {isEditingDesc ? (
            <div className="space-y-2">
              <textarea
                ref={descTextareaRef}
                value={editedDesc}
                onChange={(e) => {
                  e.stopPropagation()
                  setEditedDesc(e.target.value)
                }}
                onKeyDown={handleKeyDownDesc}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full min-h-[80px] px-3 py-2 bg-background-base border-2 border-accent-gold rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 resize-y"
                placeholder="Add a description..."
              />
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>Ctrl+Enter to save</span>
                <div className="flex-1" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveDesc()
                  }}
                  className="p-1 text-green-600 hover:text-green-700 transition-colors"
                  title="Save"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancelDesc()
                  }}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  title="Cancel"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              className="group cursor-pointer rounded-sm p-2 -m-2 transition-colors hover:bg-accent-gold/5"
              onClick={() => setIsEditingDesc(true)}
            >
              {pin.description ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {pin.description}
                </p>
              ) : (
                <p className="text-sm text-text-muted italic">Click to add description...</p>
              )}
              <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-accent-gold flex items-center gap-1">
                  <Pencil className="h-3 w-3" />
                  Edit description
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Icon Picker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Icon
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowIconPicker(true)
              }}
              className="text-xs text-accent-gold hover:text-accent-gold/80 transition-colors flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              Change
            </button>
          </div>
          <div
            className="flex items-center justify-center gap-2 rounded-sm border border-border-ornate bg-[rgb(0_0_0/0.2)] p-4 cursor-pointer hover:border-accent-gold/50 transition-colors"
            onClick={() => setShowIconPicker(true)}
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

        {/* Properties (RPG Data) */}
        {Object.keys(properties).length > 0 && (
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
        )}

        {/* Coordinates */}
        <div className="flex gap-4 text-xs text-text-secondary">
          <div>
            <span className="font-medium">Lat:</span> {formatCoordinate(pin.latitude)}
          </div>
          <div>
            <span className="font-medium">Lng:</span> {formatCoordinate(pin.longitude)}
          </div>
        </div>
      </div>

      {/* Icon Picker Dialog */}
      {showIconPicker && (
        <IconPicker
          onSelect={handleSelectIcon}
          onClose={() => setShowIconPicker(false)}
          currentIcon={pin.icon || undefined}
        />
      )}
    </>
  )
}
