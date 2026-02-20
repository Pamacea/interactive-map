"use client";

import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import type { CharacterType, CharacterRole } from "@prisma/client";
import type { CharacterFormData } from "../character-form";

const CHARACTER_TYPES: { value: CharacterType; label: string; icon: string }[] = [
  { value: "PLAYER", label: "Player Character", icon: "🎭" },
  { value: "NPC", label: "NPC", icon: "👤" },
  { value: "ENEMY", label: "Enemy", icon: "⚔️" },
  { value: "MERCHANT", label: "Merchant", icon: "💰" },
  { value: "QUEST_GIVER", label: "Quest Giver", icon: "❓" },
  { value: "COMPANION", label: "Companion", icon: "🤝" },
  { value: "BOSS", label: "Boss", icon: "👑" },
  { value: "CUSTOM", label: "Custom", icon: "⭐" },
];

const ROLES: { value: CharacterRole; label: string }[] = [
  { value: "PROTAGONIST", label: "Protagonist" },
  { value: "ANTAGONIST", label: "Antagonist" },
  { value: "SUPPORTING", label: "Supporting" },
  { value: "BACKGROUND", label: "Background" },
  { value: "MENTOR", label: "Mentor" },
  { value: "ALLY", label: "Ally" },
  { value: "NEUTRAL", label: "Neutral" },
  { value: "HOSTILE", label: "Hostile" },
  { value: "CUSTOM", label: "Custom" },
];

interface BasicInfoSectionProps {
  formData: CharacterFormData;
  updateField: (field: keyof CharacterFormData, value: string) => void;
  disabled: boolean;
}

/**
 * Basic Info Section
 * Name, short name, character type, and role fields
 */
export function BasicInfoSection({ formData, updateField, disabled }: BasicInfoSectionProps) {
  return (
    <>
      {/* Name */}
      <div>
        <Label htmlFor="name" className="text-text-secondary">
          Name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Enter character name"
          required
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Short Name / Nickname */}
      <div>
        <Label htmlFor="shortName" className="text-text-secondary">
          Short Name / Nickname
        </Label>
        <Input
          id="shortName"
          type="text"
          value={formData.shortName}
          onChange={(e) => updateField("shortName", e.target.value)}
          placeholder="Optional short name"
          className="mt-1"
          disabled={disabled}
        />
      </div>

      {/* Character Type */}
      <div>
        <Label htmlFor="characterType" className="text-text-secondary">
          Character Type
        </Label>
        <div className="mt-1 grid grid-cols-4 gap-2">
          {CHARACTER_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateField("characterType", type.value)}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-sm text-xs transition-all
                ${formData.characterType === type.value
                  ? "bg-accent-gold/20 border border-accent-gold/50"
                  : "bg-obsidian/60 border border-transparent hover:border-border-subtle"
                }
              `}
              disabled={disabled}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="capitalize">{type.label.toLowerCase().split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Role */}
      <div>
        <Label htmlFor="role" className="text-text-secondary">
          Role
        </Label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => updateField("role", e.target.value as CharacterRole)}
          className="mt-1 w-full h-10 px-3 rounded-sm bg-obsidian/60 border border-border-subtle text-text-secondary text-sm"
          disabled={disabled}
        >
          {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
