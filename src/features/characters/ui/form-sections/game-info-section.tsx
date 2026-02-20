"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { CharacterFormData } from "../character-form";

interface GameInfoSectionProps {
  formData: CharacterFormData;
  updateField: (field: keyof CharacterFormData, value: string) => void;
  disabled: boolean;
}

/**
 * Game Info Section
 * Level, class, and faction fields
 */
export function GameInfoSection({ formData, updateField, disabled }: GameInfoSectionProps) {
  return (
    <>
      {/* Level */}
      <div>
        <Label htmlFor="level" className="text-text-secondary">
          Level
        </Label>
        <Input
          id="level"
          type="number"
          min="1"
          max="1000"
          value={formData.level}
          onChange={(e) => updateField("level", e.target.value)}
          placeholder="1"
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Class */}
      <div>
        <Label htmlFor="class" className="text-text-secondary">
          Class
        </Label>
        <Input
          id="class"
          type="text"
          value={formData.class}
          onChange={(e) => updateField("class", e.target.value)}
          placeholder="Warrior, Mage, etc."
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Faction */}
      <div>
        <Label htmlFor="faction" className="text-text-secondary">
          Faction
        </Label>
        <Input
          id="faction"
          type="text"
          value={formData.faction}
          onChange={(e) => updateField("faction", e.target.value)}
          placeholder="Character's faction allegiance"
          className="mt-1"
          disabled={disabled}
        />
      </div>
    </>
  );
}
