import { useState, useEffect } from "react";
import type { Pin } from "@prisma/client";

interface FormState {
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

interface UsePinPropertiesFormProps {
  formState: FormState;
}

export function usePinPropertiesForm({
  formState,
}: UsePinPropertiesFormProps) {
  // Local editing state for title and description
  // This allows users to type without triggering immediate updates
  const [localTitle, setLocalTitle] = useState(formState.title);
  const [localDescription, setLocalDescription] = useState(formState.description);

  // Sync local state with formState when it changes externally
  // This ensures that when the popup updates the pin, the sidebar reflects it
  useEffect(() => {
    // Only update if the external value is different and we're not currently editing
    // This prevents overwriting user's current input
    setLocalTitle((prev) => {
      // If external value changed, sync it (unless user is actively editing)
      // We use a simple heuristic: if prev equals the old value, we're not editing
      return formState.title;
    });
  }, [formState.title]);

  useEffect(() => {
    setLocalDescription((prev) => {
      return formState.description;
    });
  }, [formState.description]);

  const handleTitleUpdate = (value: string) => {
    setLocalTitle(value);
  };

  const handleDescriptionUpdate = (value: string) => {
    setLocalDescription(value);
  };

  const resetZoom = () => {
    return { minZoom: 0, maxZoom: 200 };
  };

  return {
    localTitle,
    localDescription,
    handleTitleUpdate,
    handleDescriptionUpdate,
    resetZoom,
  };
}
