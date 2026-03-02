"use client";

import * as React from "react";
import { X, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";

interface CharacterDetailPanelProps {
  characterId: string;
  worldId: string;
  open: boolean;
  onClose: () => void;
}

export function CharacterDetailPanel({
  characterId,
  worldId,
  open,
  onClose,
}: CharacterDetailPanelProps) {
  const { data: character, isLoading } = useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => {
      const { getCharacterById } = await import("@/features/characters");
      return getCharacterById(characterId);
    },
    enabled: open && !!characterId,
  });

  const { data: world } = useQuery({
    queryKey: ["world", worldId],
    queryFn: async () => {
      const { getWorldById } = await import("@/features/worlds");
      return getWorldById(worldId);
    },
    enabled: open && !!worldId,
  });

  if (!open) return null;

  const isOwner = character?.userId === world?.userId;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-obsidian/95 backdrop-blur-sm border-l border-iron shadow-xl z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-iron">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <User className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-sm font-medium text-text-primary">Character</span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className="h-6 w-6 text-text-muted hover:text-text-primary"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 border-2 border-accent-gold border-t-transparent animate-spin" />
          </div>
        ) : !character ? (
          <p className="text-sm text-text-muted text-center py-8">
            Character not found
          </p>
        ) : (
          <>
            {/* Name */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{character.name}</h3>
              {character.subtitle && (
                <p className="text-sm text-text-secondary">{character.subtitle}</p>
              )}
            </div>

            {/* Stats */}
            {character.stats && (
              <div className="grid grid-cols-2 gap-2 p-3 rounded-sm bg-white/5 border border-border-subtle">
                <Stat label="Level" value={character.stats.level} />
                <Stat label="Class" value={character.stats.class || "N/A"} />
                <Stat label="HP" value={character.stats.hp || "N/A"} />
                <Stat label="AC" value={character.stats.ac || "N/A"} />
              </div>
            )}

            {/* Bio */}
            {character.bio && (
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Biography</h4>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{character.bio}</p>
              </div>
            )}

            {/* Backstory */}
            {character.backstory && (
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Backstory</h4>
                <p className="text-sm text-text-secondary whitespace-pre-wrap">{character.backstory}</p>
              </div>
            )}

            {/* Traits */}
            {character.traits && character.traits.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Traits</h4>
                <div className="flex flex-wrap gap-1">
                  {character.traits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-xs bg-purple-500/20 text-purple-300 text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {isOwner && (
              <div className="pt-4 border-t border-border-subtle">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = `/world/${worldId}/characters/${characterId}`;
                  }}
                >
                  Edit Character
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

interface StatProps {
  label: string;
  value: string | number;
}

function Stat({ label, value }: StatProps) {
  return (
    <div>
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
