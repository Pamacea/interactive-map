"use client";

import { useState, useEffect } from "react";
import { Link } from "next/navigation";
import {
  User,
  Edit,
  Trash2,
  MapPin,
  Shield,
  Sword,
  Heart,
  Brain,
  Zap,
  Eye,
  EyeOff,
  X,
  Users,
  Link2,
} from "lucide-react";
import type { Character, CharacterRelationship, CharacterPinRelation, Pin } from "@prisma/client";
import { useCharacterStore } from "@/stores/use-character-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CharacterForm } from "./character-form";

interface CharacterDetailProps {
  characterId: string;
  worldId: string;
  characters: Character[];
  onClose?: () => void;
}

type CharacterWithRelations = Character & {
  pinLinks?: Array<CharacterPinRelation & { pin: Pin }>;
  relationshipsAsSource?: Array<CharacterRelationship & { target: Character }>;
  relationshipsAsTarget?: Array<CharacterRelationship & { source: Character }>;
};

const CHARACTER_TYPE_COLORS: Record<string, string> = {
  PLAYER: "bg-blue-500/20 text-blue-400",
  NPC: "bg-gray-500/20 text-gray-400",
  ENEMY: "bg-red-500/20 text-red-400",
  MERCHANT: "bg-yellow-500/20 text-yellow-400",
  QUEST_GIVER: "bg-purple-500/20 text-purple-400",
  COMPANION: "bg-green-500/20 text-green-400",
  BOSS: "bg-orange-500/20 text-orange-400",
  CUSTOM: "bg-pink-500/20 text-pink-400",
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  strength: <Sword className="w-4 h-4" />,
  dexterity: <Zap className="w-4 h-4" />,
  constitution: <Heart className="w-4 h-4" />,
  intelligence: <Brain className="w-4 h-4" />,
  wisdom: <Eye className="w-4 h-4" />,
  charisma: <Users className="w-4 h-4" />,
  health: <Heart className="w-4 h-4 text-red-400" />,
  maxHealth: <Heart className="w-4 h-4 text-red-400" />,
  mana: <Zap className="w-4 h-4 text-blue-400" />,
  maxMana: <Zap className="w-4 h-4 text-blue-400" />,
  stamina: <Shield className="w-4 h-4 text-green-400" />,
  maxStamina: <Shield className="w-4 h-4 text-green-400" />,
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  FAMILY: "Family",
  FRIEND: "Friend",
  ENEMY: "Enemy",
  MENTOR: "Mentor",
  COMPANION: "Companion",
  ROMANTIC: "Romantic",
  ALLY: "Ally",
  SUBORDINATE: "Subordinate",
  CUSTOM: "Custom",
};

export function CharacterDetail({ characterId, worldId, characters, onClose }: CharacterDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullCharacter, setFullCharacter] = useState<CharacterWithRelations | null>(null);

  const { deleteCharacterServer, toggleVisibility, unlinkFromPin, deleteRelationship } =
    useCharacterStore();

  // Fetch full character data
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/characters/${characterId}`);
        if (response.ok) {
          const data = await response.json();
          setFullCharacter(data);
        }
      } catch (error) {
        console.error("Failed to fetch character details:", error);
      }
    };
    fetchCharacter();
  }, [characterId]);

  const character = fullCharacter || characters.find((c) => c.id === characterId);

  if (!character) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-48 text-text-muted">
          <User className="w-12 h-12 mb-2 opacity-50" />
          <p>Character not found</p>
        </div>
      </Card>
    );
  }

  const handleDelete = async () => {
    if (confirm(`Delete "${character.name}"? This action cannot be undone.`)) {
      try {
        await deleteCharacterServer(character.id);
        onClose?.();
      } catch (error) {
        console.error("Failed to delete character:", error);
        alert(error instanceof Error ? error.message : "Failed to delete character");
      }
    }
  };

  const handleToggleVisibility = async () => {
    try {
      await toggleVisibility(character.id);
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle visibility");
    }
  };

  const handleUnlinkPin = async (pinId: string) => {
    try {
      await unlinkFromPin(character.id, pinId);
      // Refetch character data
      const response = await fetch(`/api/characters/${characterId}`);
      if (response.ok) {
        const data = await response.json();
        setFullCharacter(data);
      }
    } catch (error) {
      console.error("Failed to unlink pin:", error);
      alert(error instanceof Error ? error.message : "Failed to unlink location");
    }
  };

  const handleDeleteRelationship = async (sourceId: string, targetId: string) => {
    try {
      await deleteRelationship(sourceId, targetId);
      // Refetch character data
      const response = await fetch(`/api/characters/${characterId}`);
      if (response.ok) {
        const data = await response.json();
        setFullCharacter(data);
      }
    } catch (error) {
      console.error("Failed to delete relationship:", error);
      alert(error instanceof Error ? error.message : "Failed to delete relationship");
    }
  };

  if (isEditing) {
    return (
      <CharacterForm
        worldId={worldId}
        character={character}
        onSuccess={() => {
          setIsEditing(false);
          // Refetch character data
          fetch(`/api/characters/${characterId}`)
            .then((res) => res.json())
            .then((data) => setFullCharacter(data));
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const stats = character.stats as Record<string, number> | null;
  const skills = character.skills as Array<{ name: string; level?: number }> | null;
  const equipment = character.equipment as Array<{ name: string; type?: string }> | null;

  return (
    <Card className="p-6 bg-background-card border border-border-subtle">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          {/* Portrait */}
          {character.portraitUrl ? (
            <div className="flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden bg-background-elevated border border-border-subtle">
              <img
                src={character.portraitUrl}
                alt={character.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-20 h-20 rounded-sm bg-background-elevated border border-border-subtle flex items-center justify-center">
              <User className="w-10 h-10 text-text-muted" />
            </div>
          )}

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-semibold text-xl text-text-primary">
                {character.name}
              </h2>
              {character.shortName && (
                <span className="text-sm text-text-muted">({character.shortName})</span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge
                variant="outline"
                className={CHARACTER_TYPE_COLORS[character.characterType] || ""}
              >
                {character.characterType.toLowerCase().replace("_", " ")}
              </Badge>
              {character.faction && (
                <Badge variant="outline">{character.faction}</Badge>
              )}
              {character.level && (
                <span className="text-sm text-text-secondary flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Level {character.level}
                </span>
              )}
              {character.class && (
                <span className="text-sm text-text-secondary">{character.class}</span>
              )}
            </div>

            {/* Appearance */}
            {(character.age || character.gender || character.species) && (
              <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
                {character.age && <span>{character.age} years old</span>}
                {character.gender && <span>{character.gender}</span>}
                {character.species && <span>{character.species}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleToggleVisibility}
            className={`
              h-8 w-8 p-0
              ${character.isVisible
                ? "text-accent-gold hover:bg-accent-gold/10"
                : "text-text-muted hover:bg-background-elevated"
              }
            `}
            title={character.isVisible ? "Visible" : "Hidden"}
          >
            {character.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(true)}
            className="h-8 w-8 p-0"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-text-muted hover:text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button size="sm" variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Description Sections */}
      <div className="space-y-4">
        {/* Personality */}
        {character.personality && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Personality</h3>
            <p className="text-sm text-text-muted">{character.personality}</p>
          </div>
        )}

        {/* Background */}
        {character.background && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Background</h3>
            <p className="text-sm text-text-muted whitespace-pre-wrap">{character.background}</p>
          </div>
        )}

        {/* Goals */}
        {character.goals && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Goals</h3>
            <p className="text-sm text-text-muted">{character.goals}</p>
          </div>
        )}

        {/* Fears */}
        {character.fears && (
          <div>
            <h3 className="text-sm font-semibold text-text-secondary mb-2">Fears</h3>
            <p className="text-sm text-text-muted">{character.fears}</p>
          </div>
        )}
      </div>

      {/* Stats Block */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="mt-6 p-4 bg-background-elevated border border-border-subtle rounded-sm">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Statistics
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {Object.entries(stats).map(([key, value]) => {
              if (key === "custom") return null;
              return (
                <div key={key} className="flex flex-col items-center">
                  <div className="text-text-muted">
                    {STAT_ICONS[key] || <Shield className="w-4 h-4" />}
                  </div>
                  <span className="text-lg font-semibold text-text-primary">{value}</span>
                  <span className="text-xs text-text-muted capitalize">{key}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {skill.name}
                {skill.level !== undefined && <span className="ml-1">({skill.level})</span>}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      {equipment && equipment.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <Sword className="w-4 h-4" />
            Equipment
          </h3>
          <div className="space-y-1">
            {equipment.map((item, index) => (
              <div key={index} className="text-sm text-text-secondary">
                <span className="font-medium">{item.name}</span>
                {item.type && <span className="text-text-muted ml-2">({item.type})</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked Locations */}
      {fullCharacter?.pinLinks && fullCharacter.pinLinks.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Linked Locations
          </h3>
          <div className="space-y-2">
            {fullCharacter.pinLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-2 bg-background-elevated border border-border-subtle rounded-sm"
              >
                <Link
                  href={`/world/${worldId}`}
                  className="flex-1 text-sm text-text-secondary hover:text-accent-gold transition-colors"
                >
                  {link.pin.title}
                  {link.relationType && (
                    <span className="ml-2 text-xs text-text-muted">({link.relationType})</span>
                  )}
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleUnlinkPin(link.pinId)}
                  className="h-6 w-6 p-0 text-text-muted hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Relationships */}
      {(fullCharacter?.relationshipsAsSource?.length || 0) > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Relationships
          </h3>
          <div className="space-y-2">
            {fullCharacter.relationshipsAsSource.map((rel) => (
              <div
                key={rel.id}
                className="flex items-center justify-between p-2 bg-background-elevated border border-border-subtle rounded-sm"
              >
                <div className="flex-1">
                  <Link
                    href={`/world/${worldId}/characters/${rel.target.id}`}
                    className="text-sm text-text-secondary hover:text-accent-gold transition-colors"
                  >
                    {rel.target.name}
                  </Link>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {RELATIONSHIP_LABELS[rel.relationshipType] || rel.relationshipType}
                  </Badge>
                  {rel.description && (
                    <p className="text-xs text-text-muted mt-1">{rel.description}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteRelationship(character.id, rel.targetId)}
                  className="h-6 w-6 p-0 text-text-muted hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
