"use client";

import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import type { CharacterFormData } from "../character-form";

interface BackgroundSectionProps {
  formData: CharacterFormData;
  updateField: (field: keyof CharacterFormData, value: string) => void;
  disabled: boolean;
}

/**
 * Background Section
 * Character backstory field
 */
export function BackgroundSection({ formData, updateField, disabled }: BackgroundSectionProps) {
  return (
    <div>
      <Label htmlFor="background" className="text-text-secondary">
        Background
      </Label>
      <Textarea
        id="background"
        value={formData.background}
        onChange={(e) => updateField("background", e.target.value)}
        placeholder="Character's history and backstory..."
        rows={3}
        className="mt-1 resize-none"
        disabled={disabled}
      />
    </div>
  );
}
