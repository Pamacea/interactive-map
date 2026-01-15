"use client";

import { useCallback } from "react";
import type { PinWithLayer } from "./use-pins-filtering";

interface UseMapHandlersProps {
  isCreatingPin: boolean;
  selectPin: (id: string | null) => void;
  clearSelection: () => void;
  stopCreating: () => void;
  startCreating: () => void;
}

interface MapHandlers {
  handlePinClick: (pin: PinWithLayer) => void;
  handlePopupClose: () => void;
  handleToggleCreatePin: () => void;
}

export function useMapHandlers({
  isCreatingPin,
  selectPin,
  clearSelection,
  stopCreating,
  startCreating,
}: UseMapHandlersProps): MapHandlers {
  const handlePinClick = useCallback(
    (pin: PinWithLayer) => {
      selectPin(pin.id);
    },
    [selectPin]
  );

  const handlePopupClose = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  const handleToggleCreatePin = useCallback(() => {
    if (isCreatingPin) {
      stopCreating();
    } else {
      selectPin(null);
      startCreating();
    }
  }, [isCreatingPin, stopCreating, selectPin, startCreating]);

  return {
    handlePinClick,
    handlePopupClose,
    handleToggleCreatePin,
  };
}
