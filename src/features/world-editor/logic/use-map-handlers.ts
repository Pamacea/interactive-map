"use client";

import { useCallback } from "react";
import type { PinWithLayer } from "./use-pins-filtering";

interface UseMapHandlersProps {
  isCreatingPin?: boolean;
  selectPin: (id: string | null) => void;
  clearSelection: () => void;
  stopCreating?: () => void;
  startCreating?: () => void;
}

// Deprecated: isCreatingPin, stopCreating, startCreating are no longer used
// Kept for backward compatibility - do not use
export type DeprecatedMapHandlersProps = Omit<UseMapHandlersProps, 'selectPin' | 'clearSelection'>;

interface MapHandlers {
  handlePinClick: (pin: PinWithLayer) => void;
  handlePopupClose: () => void;
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

  return {
    handlePinClick,
    handlePopupClose,
  };
}
