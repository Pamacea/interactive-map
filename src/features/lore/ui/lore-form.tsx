"use client";

import { LoreFormHeader, LoreFormError } from "./lore-form-fields";
import { LoreFormActions } from "./lore-form-actions";
import { LoreFormFields } from "./lore-form-inputs";
import { useLoreForm } from "../logic/use-lore-form";
import type { LoreEntry } from "@/types/lore.type";

interface LoreFormProps {
  worldId: string;
  lore?: LoreEntry;
  onSuccess?: () => void;
}

export function LoreForm({ worldId, lore, onSuccess }: LoreFormProps) {
  const {
    formData,
    isSubmitting,
    error,
    isEditing,
    updateField,
    handleSubmit,
    handleCancel,
  } = useLoreForm({ worldId, lore, onSuccess });

  return (
    <div className="flex flex-col gap-4 p-4 bg-obsidian/70 border border-iron/50 rounded-sm">
      <LoreFormHeader isEditing={isEditing} onClose={handleCancel} />

      <div className="flex flex-col gap-4">
        <LoreFormError error={error} />
        <LoreFormFields
          formData={formData}
          isSubmitting={isSubmitting}
          updateField={updateField}
        />
        <LoreFormActions
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
