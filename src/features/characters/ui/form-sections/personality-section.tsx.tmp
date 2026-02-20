"use client";

import { Textarea } from "@/shared/ui/textarea";
import { Label } from "@/shared/ui/label";
import type { CharacterFormData } from "../character-form";

interface PersonalitySectionProps {
  formData: CharacterFormData;
  updateField: (field: keyof CharacterFormData, value: string) => void;
  disabled: boolean;
}

/**
 * Personality Section
 * Personality, goals, and fears fields
 */
export function PersonalitySection({ formData, updateField, disabled }: PersonalitySectionProps) {
  return (
    <>
      {/* Personality */}
      <div>
        <Label htmlFor="personality" className="text-text-secondary">
          Personality
        </Label>
        <Textarea
          id="personality"
          value={formData.personality}
          onChange={(e) => updateField("personality", e.target.value)}
          placeholder="Describe the character's personality traits..."
          rows={2}
          className="mt-1 resize-none"
          disabled={disabled}
        />
      </div>

      {/* Goals */}
      <div>
        <Label htmlFor="goals" className="text-text-secondary">
          Goals & Motivations
        </Label>
        <Textarea
          id="goals"
          value={formData.goals}
          onChange={(e) => updateField("goals", e.target.value)}
          placeholder="What drives this character..."
          rows={2}
          className="mt-1 resize-none"
          disabled={disabled}
        />
      </div>

      {/* Fears */}
      <div>
        <Label htmlFor="fears" className="text-text-secondary">
          Fears & Weaknesses
        </Label>
        <Textarea
          id="fears"
          value={formData.fears}
          onChange={(e) => updateField("fears", e.target.value)}
          placeholder="What does this character fear..."
          rows={2}
          className="mt-1 resize-none"
          disabled={disabled}
        />
      </div>
    </>
  );
}
