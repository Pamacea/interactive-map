"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { CharacterFormData } from "../character-form";

interface PortraitSectionProps {
  formData: CharacterFormData;
  updateField: (field: keyof CharacterFormData, value: string) => void;
  disabled: boolean;
}

/**
 * Portrait Section
 * Portrait URL field
 */
export function PortraitSection({ formData, updateField, disabled }: PortraitSectionProps) {
  return (
    <div>
      <Label htmlFor="portraitUrl" className="text-text-secondary">
        Portrait URL
      </Label>
      <Input
        id="portraitUrl"
        type="url"
        value={formData.portraitUrl}
        onChange={(e) => updateField("portraitUrl", e.target.value)}
        placeholder="https://example.com/portrait.jpg"
        className="mt-1"
        disabled={disabled}
      />
    </div>
  );
}
