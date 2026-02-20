"use client";

import { useState, useEffect } from "react";
import { X, User, Loader2 } from "lucide-react";
import type { Character, CharacterType, CharacterRole } from "@prisma/client";
import { useCharacterStore } from "@/features/characters/store/use-character-store";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { BasicInfoSection } from "./form-sections/basic-info-section";
import { GameInfoSection } from "./form-sections/game-info-section";
import { AppearanceSection } from "./form-sections/appearance-section";
import { PersonalitySection } from "./form-sections/personality-section";
import { BackgroundSection } from "./form-sections/background-section";
import { PortraitSection } from "./form-sections/portrait-section";

export interface CharacterFormData {
  name: string;
  shortName: string;
  characterType: CharacterType;
  role: CharacterRole;
  age: string;
  gender: string;
  species: string;
  height: string;
  build: string;
  level: string;
  class: string;
  faction: string;
  personality: string;
  background: string;
  goals: string;
  fears: string;
  portraitUrl: string;
}

interface CharacterFormProps {
  worldId: string;
  character?: Character;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CharacterForm({ worldId, character, onSuccess, onCancel }: CharacterFormProps) {
  const { isCreating, isEditing, createCharacter, updateCharacterServer, stopCreating, stopEditing } =
    useCharacterStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CharacterFormData>({
    name: "",
    shortName: "",
    characterType: "NPC",
    role: "SUPPORTING",
    age: "",
    gender: "",
    species: "",
    height: "",
    build: "",
    level: "",
    class: "",
    faction: "",
    personality: "",
    background: "",
    goals: "",
    fears: "",
    portraitUrl: "",
  });

  // Initialize form with character data if editing
  useEffect(() => {
    if (character) {
      setFormData({
        name: character.name,
        shortName: character.shortName || "",
        characterType: character.characterType,
        role: character.role,
        age: character.age?.toString() || "",
        gender: character.gender || "",
        species: character.species || "",
        height: character.height || "",
        build: character.build || "",
        level: character.level?.toString() || "",
        class: character.class || "",
        faction: character.faction || "",
        personality: character.personality || "",
        background: character.background || "",
        goals: character.goals || "",
        fears: character.fears || "",
        portraitUrl: character.portraitUrl || "",
      });
    }
  }, [character]);

  const updateField = (field: keyof CharacterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (character) {
        // Update existing character
        await updateCharacterServer({
          id: character.id,
          name: formData.name,
          shortName: formData.shortName || undefined,
          characterType: formData.characterType,
          role: formData.role,
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          gender: formData.gender || undefined,
          species: formData.species || undefined,
          height: formData.height || undefined,
          build: formData.build || undefined,
          level: formData.level ? parseInt(formData.level, 10) : undefined,
          class: formData.class || undefined,
          faction: formData.faction || undefined,
          personality: formData.personality || undefined,
          background: formData.background || undefined,
          goals: formData.goals || undefined,
          fears: formData.fears || undefined,
          portraitUrl: formData.portraitUrl || undefined,
        });
      } else {
        // Create new character
        await createCharacter({
          name: formData.name,
          shortName: formData.shortName || undefined,
          characterType: formData.characterType,
          role: formData.role,
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          gender: formData.gender || undefined,
          species: formData.species || undefined,
          height: formData.height || undefined,
          build: formData.build || undefined,
          level: formData.level ? parseInt(formData.level, 10) : undefined,
          class: formData.class || undefined,
          faction: formData.faction || undefined,
          personality: formData.personality || undefined,
          background: formData.background || undefined,
          goals: formData.goals || undefined,
          fears: formData.fears || undefined,
          portraitUrl: formData.portraitUrl || undefined,
          gameWorldId: worldId,
        });
      }

      stopCreating();
      stopEditing();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save character");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    stopCreating();
    stopEditing();
    onCancel?.();
  };

  const isEditingForm = isCreating || isEditing || !!character;

  return (
    <Card className="p-4 bg-obsidian/80 border border-border-subtle">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-accent-gold" />
          <h3 className="font-display font-semibold text-text-primary">
            {character ? "Edit Character" : "New Character"}
          </h3>
        </div>
        <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <BasicInfoSection formData={formData} updateField={updateField} disabled={isSubmitting} />

        {/* Game Info Row */}
        <div className="grid grid-cols-3 gap-4">
          <GameInfoSection formData={formData} updateField={updateField} disabled={isSubmitting} />
        </div>

        {/* Appearance Row */}
        <div className="grid grid-cols-3 gap-4">
          <AppearanceSection formData={formData} updateField={updateField} disabled={isSubmitting} />
        </div>

        <PersonalitySection formData={formData} updateField={updateField} disabled={isSubmitting} />

        <BackgroundSection formData={formData} updateField={updateField} disabled={isSubmitting} />

        <PortraitSection formData={formData} updateField={updateField} disabled={isSubmitting} />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-4"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !formData.name.trim()}
            className="px-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              character ? "Update Character" : "Create Character"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
