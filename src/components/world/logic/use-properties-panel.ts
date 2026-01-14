import { useState, useEffect, useCallback } from "react";
import { useSelectedPin } from "@/stores/use-pins-store";
import { updatePin } from "@/actions/pins";
import type { Pin } from "@prisma/client";

interface PinFormState {
  title: string;
  description: string;
  pinType: Pin["pinType"];
  size: number;
  color: string;
  isVisible: boolean;
}

export function usePropertiesPanel() {
  const selectedPin = useSelectedPin();
  const [formState, setFormState] = useState<PinFormState>({
    title: "",
    description: "",
    pinType: "CUSTOM",
    size: 32,
    color: "#3b82f6",
    isVisible: true,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Update form when pin selection changes
  useEffect(() => {
    if (selectedPin) {
      setFormState({
        title: selectedPin.title,
        description: selectedPin.description || "",
        pinType: selectedPin.pinType,
        size: selectedPin.size,
        color: selectedPin.color,
        isVisible: selectedPin.isVisible,
      });
    }
  }, [selectedPin]);

  // Handle pin updates with generic type safety
  const handleUpdatePin = useCallback(
    async <K extends keyof Pin>(field: K, value: Pin[K]) => {
      if (!selectedPin || isUpdating) return;

      setIsUpdating(true);
      try {
        await updatePin({
          id: selectedPin.id,
          [field]: value,
        });

        // Update local form state
        setFormState((prev) => ({ ...prev, [field]: value }));
      } catch (error) {
        console.error("Failed to update pin:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedPin, isUpdating]
  );

  return {
    selectedPin,
    formState,
    isUpdating,
    handleUpdatePin,
  };
}
