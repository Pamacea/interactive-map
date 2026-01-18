"use client";

import { useState, useCallback } from "react";
import { useLoreStore } from "@/stores/use-lore-store";
import type { LoreEntry, LoreCategory } from "@/types/lore.type";

interface UseLoreFormOptions {
  worldId: string;
  onSuccess?: (loreEntry: LoreEntry) => void;
  onError?: (error: Error) => void;
}

interface LoreFormState {
  title: string;
  content: string;
  category: LoreCategory;
  isVisible: boolean;
  isPublic: boolean;
}

/**
 * Hook to manage lore entry form state and submissions
 * Follows the pattern used for pins with form validation
 */
export function useLoreForm({
  worldId,
  onSuccess,
  onError,
}: UseLoreFormOptions) {
  const [formData, setFormData] = useState<LoreFormState>({
    title: "",
    content: "",
    category: "GENERAL",
    isVisible: false,
    isPublic: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoreFormState, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createLoreEntry = useLoreStore((state) => state.createLoreEntry);
  const updateLoreEntryServer = useLoreStore((state) => state.updateLoreEntryServer);

  // Update form field
  const updateField = useCallback(
    <K extends keyof LoreFormState>(field: K, value: LoreFormState[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field when user updates it
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof LoreFormState, string>> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length > 50000) {
      newErrors.content = "Content must be less than 50,000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      title: "",
      content: "",
      category: "GENERAL",
      isVisible: false,
      isPublic: true,
    });
    setErrors({});
  }, []);

  // Initialize form with existing lore entry data
  const initializeFromLore = useCallback((loreEntry: LoreEntry) => {
    setFormData({
      title: loreEntry.title,
      content: loreEntry.content,
      category: loreEntry.category,
      isVisible: loreEntry.isVisible,
      isPublic: loreEntry.isPublic,
    });
    setErrors({});
  }, []);

  // Submit form (create or update)
  const submitForm = useCallback(
    async (loreEntryId?: string) => {
      if (!validateForm()) {
        return false;
      }

      setIsSubmitting(true);

      try {
        if (loreEntryId) {
          // Update existing lore entry
          await updateLoreEntryServer({
            id: loreEntryId,
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            isVisible: formData.isVisible,
            isPublic: formData.isPublic,
          });
        } else {
          // Create new lore entry
          await createLoreEntry({
            title: formData.title.trim(),
            content: formData.content.trim(),
            category: formData.category,
            isVisible: formData.isVisible,
            isPublic: formData.isPublic,
            gameWorldId: worldId,
          });

          // Call success callback without passing result
          onSuccess?.(undefined as unknown as LoreEntry);
        }

        resetForm();
        return true;
      } catch (error) {
        const err = error instanceof Error ? error : new Error("Failed to save lore entry");
        onError?.(err);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, worldId, createLoreEntry, updateLoreEntryServer, onSuccess, onError, resetForm]
  );

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    resetForm,
    initializeFromLore,
    submitForm,
    isValid: Object.keys(errors).length === 0,
  };
}
