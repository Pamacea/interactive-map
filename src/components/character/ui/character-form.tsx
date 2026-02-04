"use client";

import { useState, useEffect } from "react";
import { X, User, Loader2 } from "lucide-react";
import type { Character, CharacterType, CharacterRole } from "@prisma/client";
import { useCharacterStore } from "@/stores/use-character-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  CharacterStats,
  CharacterSkill,
  CharacterEquipment,
} from "@/components/character/logic/character-schemas";

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

interface CharacterFormData {
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
    <Card className="p-4 bg-background-card border border-border-subtle">
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
                    : "bg-background-elevated border border-transparent hover:border-border-subtle"
                  }
                `}
                disabled={isSubmitting}
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
            className="mt-1 w-full h-10 px-3 rounded-sm bg-background-elevated border border-border-subtle text-text-secondary text-sm"
            disabled={isSubmitting}
          >
            {ROLES.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Info Row */}
        <div className="grid grid-cols-2 gap-4">
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
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
            disabled={isSubmitting}
          />
        </div>

        {/* Appearance Row */}
        <div className="grid grid-cols-3 gap-4">
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Height & Build */}
        <div className="grid grid-cols-2 gap-4">
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
              disabled={isSubmitting}
            />
          </div>
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
              disabled={isSubmitting}
            />
          </div>
        </div>

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
            disabled={isSubmitting}
          />
        </div>

        {/* Background */}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        {/* Portrait URL */}
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
            disabled={isSubmitting}
          />
        </div>

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
