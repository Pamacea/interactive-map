import { useState, useEffect, useCallback } from "react";
import { useSelectedPin, useUpdatePin, usePinsStore } from "@/stores/use-pins-store";
import { updatePin, uploadPinIcon } from "@/actions/pins";
import { useToast } from "@/hooks/use-toast";
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
  const { showToast } = useToast();

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
  const [lastKnownGoodState, setLastKnownGoodState] = useState<PinFormState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Update form when pin selection changes OR when pin data changes in store
  // This ensures sync between sidebar and popup when either updates
  useEffect(() => {
    if (selectedPin) {
      const newFormState = {
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
      };

      // Only update if values actually changed (prevent infinite loops)
      setFormState((prev) => {
        const hasChanged = Object.keys(newFormState).some(
          (key) => newFormState[key as keyof PinFormState] !== prev[key as keyof PinFormState]
        );
        return hasChanged ? newFormState : prev;
      });
    }
  }, [selectedPin]); // Will re-run whenever selectedPin object reference changes from store updates

  // Handle pin updates with optimistic updates
  const handleUpdatePin = useCallback(
    async <K extends keyof Pin>(field: K, value: Pin[K]) => {
      if (!selectedPin || isUpdating) return;

      setIsUpdating(true);
      setError(null);
      const previousValue = formState[field as keyof PinFormState];

      // Save last known good state before update
      setLastKnownGoodState(formState);

      try {
        // Optimistic update: Update local form state immediately
        setFormState((prev) => ({ ...prev, [field]: value }));

        // Optimistic update: Update Zustand store immediately
        updatePinInStore(selectedPin.id, { [field]: value } as Partial<Pin>);

        // Persist to database (fire-and-forget since Zustand is source of truth)
        await updatePin({
          id: selectedPin.id,
          [field]: value,
        });

        // Clear last known good state on success
        setLastKnownGoodState(null);
        showToast("Pin updated successfully", "success");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update pin";

        // Check for concurrent edit conflict
        if (errorMessage.includes("concurrent") || errorMessage.includes("conflict")) {
          showToast("This pin was modified by another user. Please refresh.", "error");
        } else {
          showToast(`Failed to update pin: ${errorMessage}`, "error");
        }

        setError(errorMessage);

        // Rollback: Revert all updates on error
        setFormState((prev) => ({ ...prev, [field]: previousValue }));
        updatePinInStore(selectedPin.id, { [field]: previousValue } as Partial<Pin>);

        // Also rollback to last known good state if available
        if (lastKnownGoodState) {
          setFormState(lastKnownGoodState);
          updatePinInStore(selectedPin.id, lastKnownGoodState as Partial<Pin>);
        }
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedPin, isUpdating, formState, updatePinInStore, showToast, lastKnownGoodState]
  );

  // Handle custom icon upload
  const handleIconUpload = useCallback(
    async (file: File) => {
      if (!selectedPin) throw new Error("No pin selected");

      setIsUpdating(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const result = await uploadPinIcon(selectedPin.id, formData);

        if (!result.success) {
          throw new Error(result.error.message);
        }

        // Update local state
        setFormState((prev) => ({ ...prev, icon: result.data.pin.icon }));

        // Update Zustand store (source of truth)
        updatePinInStore(selectedPin.id, { icon: result.data.pin.icon });

        showToast("Icon uploaded successfully", "success");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to upload icon";
        showToast(`Failed to upload icon: ${errorMessage}`, "error");
        setError(errorMessage);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [selectedPin, updatePinInStore, showToast]
  );

  // Retry failed update
  const retryUpdate = useCallback(() => {
    if (error && lastKnownGoodState) {
      setError(null);
      // Trigger a refetch by re-fetching from server action
      // Note: This will be handled by calling component
    }
  }, [error, lastKnownGoodState]);

  return {
    selectedPin,
    formState,
    isUpdating,
    error,
    handleUpdatePin,
    handleIconUpload,
    retryUpdate,
  };
}
