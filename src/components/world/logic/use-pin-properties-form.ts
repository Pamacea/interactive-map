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
  const [localTitle, setLocalTitle] = useState(formState.title);
  const [localDescription, setLocalDescription] = useState(formState.description);

  useEffect(() => {
    setLocalTitle(formState.title);
    setLocalDescription(formState.description);
  }, [formState.title, formState.description]);

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
