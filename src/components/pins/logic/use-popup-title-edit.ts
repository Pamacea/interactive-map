import { useState, useEffect, useRef } from "react";
import { useUpdatePinServer, useUpdatePin } from "@/stores/use-pins-store";

interface UsePopupTitleEditOptions {
  pinId: string;
  initialTitle: string;
  onTitleChange?: (newTitle: string) => void;
}

export function usePopupTitleEdit({
  pinId,
  initialTitle,
  onTitleChange,
}: UsePopupTitleEditOptions) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  const updatePinServer = useUpdatePinServer();
  const updatePin = useUpdatePin();

  useEffect(() => {
    if (!isEditing) {
      setEditedTitle(initialTitle);
    }
  }, [initialTitle, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditedTitle(initialTitle);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(initialTitle);
  };

  const handleSaveEdit = async () => {
    if (!editedTitle.trim()) {
      handleCancelEdit();
      return;
    }

    const newTitle = editedTitle.trim();

    updatePin(pinId, { title: newTitle });
    setIsEditing(false);
    onTitleChange?.(newTitle);

    try {
      await updatePinServer({ id: pinId, title: newTitle });
    } catch (error) {
      console.error("Failed to update pin title:", error);
      setEditedTitle(initialTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return {
    isEditing,
    editedTitle,
    inputRef,
    setEditedTitle,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleKeyDown,
  };
}
