import { useState, useEffect, useCallback } from "react";
import { useSelectedPin, useUpdatePin } from "@/stores/use-pins-store";
import { updatePin } from "@/actions/pins";
import { useQueryClient } from "@tanstack/react-query";
import type { Pin } from "@prisma/client";

interface PinFormState {
  title: string;
  description: string;
  pinType: Pin["pinType"];
  icon: string | null;
  size: number;
  color: string;
  opacity: number;
  isVisible: boolean;
  minZoom: number;
  maxZoom: number;
}

export function usePropertiesPanel() {
  const selectedPin = useSelectedPin();
  const updatePinInStore = useUpdatePin();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState<PinFormState>({
    title: "",
    description: "",
    pinType: "CUSTOM",
    icon: null,
    size: 32,
    color: "#3b82f6",
    opacity: 1,
    isVisible: true,
    minZoom: 0,
    maxZoom: 200,
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Update form when pin selection changes
  useEffect(() => {
    if (selectedPin) {
      setFormState({
        title: selectedPin.title,
        description: selectedPin.description || "",
        pinType: selectedPin.pinType,
        icon: selectedPin.icon,
        size: selectedPin.size,
        color: selectedPin.color,
        opacity: selectedPin.opacity ?? 1,
        isVisible: selectedPin.isVisible,
        minZoom: selectedPin.minZoom ?? 0,
        maxZoom: selectedPin.maxZoom ?? 200,
      });
    }
  }, [selectedPin]);

  // Handle pin updates with optimistic updates
  const handleUpdatePin = useCallback(
    async <K extends keyof Pin>(field: K, value: Pin[K]) => {
      if (!selectedPin || isUpdating) return;

      setIsUpdating(true);
      const previousValue = formState[field as keyof PinFormState];

      try {
        // Optimistic update: Update local form state immediately
        setFormState((prev) => ({ ...prev, [field]: value }));

        // Optimistic update: Update Zustand store immediately
        updatePinInStore(selectedPin.id, { [field]: value } as Partial<Pin>);

        // Optimistic update: Update TanStack Query cache
        queryClient.setQueryData<Pin[]>(
          ["pins", selectedPin.gameWorldId],
          (old = []) =>
            old.map((pin) =>
              pin.id === selectedPin.id
                ? { ...pin, [field]: value, updatedAt: new Date() }
                : pin
            )
        );

        // Persist to database
        await updatePin({
          id: selectedPin.id,
          [field]: value,
        });

        console.log("✅ Pin property updated:", { field, value });
      } catch (error) {
        console.error("❌ Failed to update pin:", error);

        // Rollback: Revert all updates on error
        setFormState((prev) => ({ ...prev, [field]: previousValue }));
        updatePinInStore(selectedPin.id, { [field]: previousValue } as Partial<Pin>);

        // Note: TanStack Query cache will auto-refetch on error
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedPin, isUpdating, formState, updatePinInStore, queryClient]
  );

  return {
    selectedPin,
    formState,
    isUpdating,
    handleUpdatePin,
  };
}
