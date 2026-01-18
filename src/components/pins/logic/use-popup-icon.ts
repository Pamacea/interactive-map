/**
 * Hook for managing icon selection state and operations
 */

import * as React from "react"
import { useUpdatePinServer, useUpdatePin } from "@/stores/use-pins-store"
import type { Pin } from "@prisma/client"

export function usePopupIcon(pin: Pin) {
  const [isOpen, setIsOpen] = React.useState(false)

  const updatePinServer = useUpdatePinServer()
  const updatePin = useUpdatePin()

  const handleSelect = async (iconName: string) => {
    // Optimistic update
    updatePin(pin.id, { icon: iconName })

    // Server sync
    try {
      await updatePinServer({ id: pin.id, icon: iconName })
    } catch (error) {
      console.error("Failed to update pin icon:", error)
    }
  }

  const openPicker = () => setIsOpen(true)
  const closePicker = () => setIsOpen(false)

  return {
    isOpen,
    openPicker,
    closePicker,
    handleSelect,
  }
}
