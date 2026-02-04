"use client";

import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import { getCharactersForPin } from "@/actions/characters";
import { useCharacterStore } from "@/stores/use-character-store";
import type { Character } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LinkedCharacter {
  id: string;
  name: string;
  shortName: string | null;
  portraitUrl: string | null;
  characterType: string;
  level: number | null;
  faction: string | null;
  relationType: string;
  notes: string | null;
  linkId: string;
}

interface PinCharactersSectionProps {
  pinId: string;
  worldId: string;
}

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

const CHARACTER_TYPE_ICONS: Record<string, string> = {
  PLAYER: "🎭",
  NPC: "👤",
  ENEMY: "⚔️",
  MERCHANT: "💰",
  QUEST_GIVER: "❓",
  COMPANION: "🤝",
  BOSS: "👑",
  CUSTOM: "⭐",
};

export function PinCharactersSection({ pinId, worldId }: PinCharactersSectionProps) {
  const [linkedCharacters, setLinkedCharacters] = useState<LinkedCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const unlinkFromPin = useCharacterStore((state) => state.unlinkFromPin);

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const data = await getCharactersForPin(pinId);
        setLinkedCharacters(data as LinkedCharacter[]);
      } catch (error) {
        console.error("Failed to fetch linked characters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacters();
  }, [pinId]);

  const handleUnlink = async (characterId: string) => {
    try {
      await unlinkFromPin(characterId, pinId);
      setLinkedCharacters((prev) => prev.filter((c) => c.id !== characterId));
    } catch (error) {
      console.error("Failed to unlink character:", error);
      alert(error instanceof Error ? error.message : "Failed to unlink character");
    }
  };

  if (isLoading) {
    return (
      <div className="border-t border-border-subtle pt-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
          <User className="w-4 h-4" />
          <span>Characters</span>
        </div>
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-gold border-t-transparent" />
        </div>
      </div>
    );
  }

  if (linkedCharacters.length === 0) {
    return (
      <div className="border-t border-border-subtle pt-3">
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
          <User className="w-4 h-4" />
          <span>Characters</span>
        </div>
        <p className="text-xs text-text-muted">No characters linked to this location</p>
      </div>
    );
  }

  return (
    <div className="border-t border-border-subtle pt-3">
      <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
        <User className="w-4 h-4" />
        <span>Characters ({linkedCharacters.length})</span>
      </div>

      <div className="space-y-2">
        {linkedCharacters.map((character) => {
          const typeIcon = CHARACTER_TYPE_ICONS[character.characterType] || "👤";
          const typeColor = CHARACTER_TYPE_COLORS[character.characterType] || "";

          return (
            <div
              key={character.linkId}
              className="flex items-start gap-2 p-2 rounded-sm bg-background-elevated border border-border-subtle group"
            >
              {/* Portrait or Icon */}
              {character.portraitUrl ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-sm overflow-hidden bg-background-card">
                  <img
                    src={character.portraitUrl}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-background-card flex items-center justify-center text-sm">
                  {typeIcon}
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text-secondary truncate">
                    {character.name}
                  </span>
                  <Badge variant="outline" className={`text-xs px-1 py-0 ${typeColor}`}>
                    {character.characterType.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  {character.relationType && (
                    <span className="text-xs text-text-muted">
                      {character.relationType.toLowerCase()}
                    </span>
                  )}
                  {character.level && (
                    <span className="text-xs text-text-muted">Lv. {character.level}</span>
                  )}
                  {character.faction && (
                    <span className="text-xs text-text-muted">{character.faction}</span>
                  )}
                </div>

                {character.notes && (
                  <p className="text-xs text-text-muted mt-1 line-clamp-2">{character.notes}</p>
                )}
              </div>

              {/* Unlink Button */}
              <button
                onClick={() => handleUnlink(character.id)}
                className="flex-shrink-0 h-6 w-6 p-0 text-text-muted hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
