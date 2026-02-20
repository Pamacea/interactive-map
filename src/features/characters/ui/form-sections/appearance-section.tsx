"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { CharacterFormData } from "../character-form";

interface AppearanceSectionProps {
  formData: CharacterFormData;
  updateField: (field: keyof CharacterFormData, value: string) => void;
  disabled: boolean;
}

/**
 * Appearance Section
 * Age, gender, species, height, and build fields
 */
export function AppearanceSection({ formData, updateField, disabled }: AppearanceSectionProps) {
  return (
    <>
      {/* Age */}
      <div>
        <Label htmlFor="age" className="text-text-secondary">
          Age
        </Label>
        <Input
          id="age"
          type="number"
          min="0"
          max="10000"
          value={formData.age}
          onChange={(e) => updateField("age", e.target.value)}
          placeholder="25"
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Gender */}
      <div>
        <Label htmlFor="gender" className="text-text-secondary">
          Gender
        </Label>
        <Input
          id="gender"
          type="text"
          value={formData.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          placeholder="Male, Female, etc."
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Species */}
      <div>
        <Label htmlFor="species" className="text-text-secondary">
          Species
        </Label>
        <Input
          id="species"
          type="text"
          value={formData.species}
          onChange={(e) => updateField("species", e.target.value)}
          placeholder="Human, Elf, etc."
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Height */}
      <div>
        <Label htmlFor="height" className="text-text-secondary">
          Height
        </Label>
        <Input
          id="height"
          type="text"
          value={formData.height}
          onChange={(e) => updateField("height", e.target.value)}
          placeholder="5'10&quot; / 178cm"
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Build */}
      <div>
        <Label htmlFor="build" className="text-text-secondary">
          Build
        </Label>
        <Input
          id="build"
          type="text"
          value={formData.build}
          onChange={(e) => updateField("build", e.target.value)}
          placeholder="Athletic, slim, etc."
          className="mt-1"
          disabled={disabled}
        />
      </div>
    </>
  );
}
