/**
 * Hook for managing description editing state and operations
 */

import * as React from "react"
import { usePinsStore } from "@/stores/use-pins-store"
import type { Pin } from "@prisma/client"

export function usePopupDescription(pin: Pin) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedDesc, setEditedDesc] = React.useState(pin.description || "")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const updatePinServer = usePinsStore((state) => state.updatePinServer)
  const updatePin = usePinsStore((state) => state.updatePin)

  // Keep local state in sync with pin prop when not editing
  React.useEffect(() => {
    if (!isEditing) {
      setEditedDesc(pin.description || "")
    }
  }, [pin.description, isEditing])

  // Focus textarea when editing starts
  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleSave = async () => {
    const newDesc = editedDesc.trim()

    // Optimistic update
    updatePin(pin.id, { description: newDesc })
    setIsEditing(false)

    // Server sync
    try {
      await updatePinServer({ id: pin.id, description: newDesc })
    } catch (error) {
      console.error("Failed to update pin description:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedDesc(pin.description || "")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  const startEditing = () => setIsEditing(true)

  return {
    isEditing,
    editedDesc,
    setEditedDesc,
    textareaRef,
    startEditing,
    handleSave,
    handleCancel,
    handleKeyDown,
  }
}
