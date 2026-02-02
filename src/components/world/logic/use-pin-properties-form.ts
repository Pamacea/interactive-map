import { useState, useEffect, useRef } from "react";
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

  // Track previous values to detect changes
  const prevTitleRef = useRef(formState.title);
  const prevDescriptionRef = useRef(formState.description);

  // Sync local state with formState when it changes externally
  // This ensures that when the popup updates the pin, the sidebar reflects it
  useEffect(() => {
    if (prevTitleRef.current !== formState.title) {
      // Defer setState to avoid calling setState synchronously within effect
      setTimeout(() => setLocalTitle(formState.title), 0);
      prevTitleRef.current = formState.title;
    }
  }, [formState.title]);

  useEffect(() => {
    if (prevDescriptionRef.current !== formState.description) {
      // Defer setState to avoid calling setState synchronously within effect
      setTimeout(() => setLocalDescription(formState.description), 0);
      prevDescriptionRef.current = formState.description;
    }
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
