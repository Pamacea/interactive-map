"use client";

import Image from "next/image";
import { Clock, Eye, EyeOff, Edit, Trash2, Shield } from "lucide-react";
import type { Character, CharacterType } from "@prisma/client";
import { useCharacterStore } from "@/stores/use-character-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Simple utility to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds >= intervals.year) {
    const years = Math.floor(seconds / intervals.year);
    return `${years}y ago`;
  }
  if (seconds >= intervals.month) {
    const months = Math.floor(seconds / intervals.month);
    return `${months}mo ago`;
  }
  if (seconds >= intervals.week) {
    const weeks = Math.floor(seconds / intervals.week);
    return `${weeks}w ago`;
  }
  if (seconds >= intervals.day) {
    const days = Math.floor(seconds / intervals.day);
    return `${days}d ago`;
  }
  if (seconds >= intervals.hour) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours}h ago`;
  }
  if (seconds >= intervals.minute) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes}m ago`;
  }
  return "now";
}

const CHARACTER_TYPE_ICONS: Record<CharacterType, string> = {
  PLAYER: "🎭",
  NPC: "👤",
  ENEMY: "⚔️",
  MERCHANT: "💰",
  QUEST_GIVER: "❓",
  COMPANION: "🤝",
  BOSS: "👑",
  CUSTOM: "⭐",
};

const CHARACTER_TYPE_COLORS: Record<CharacterType, string> = {
  PLAYER: "bg-blue-500/20 text-blue-400",
  NPC: "bg-gray-500/20 text-gray-400",
  ENEMY: "bg-red-500/20 text-red-400",
  MERCHANT: "bg-yellow-500/20 text-yellow-400",
  QUEST_GIVER: "bg-purple-500/20 text-purple-400",
  COMPANION: "bg-green-500/20 text-green-400",
  BOSS: "bg-orange-500/20 text-orange-400",
  CUSTOM: "bg-pink-500/20 text-pink-400",
};

interface CharacterCardProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const deleteCharacterServer = useCharacterStore((state) => state.deleteCharacterServer);
  const selectCharacter = useCharacterStore((state) => state.selectCharacter);
  const startEditing = useCharacterStore((state) => state.startEditing);
  const toggleVisibility = useCharacterStore((state) => state.toggleVisibility);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectCharacter(character.id);
    startEditing();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete "${character.name}"? This action cannot be undone.`)) {
      try {
        await deleteCharacterServer(character.id);
      } catch (error) {
        console.error("Failed to delete character:", error);
        alert(error instanceof Error ? error.message : "Failed to delete character");
      }
    }
  };

  const _handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleVisibility(character.id);
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle visibility");
    }
  };

  const timeAgo = formatTimeAgo(new Date(character.updatedAt));
  const typeIcon = CHARACTER_TYPE_ICONS[character.characterType];
  const typeColor = CHARACTER_TYPE_COLORS[character.characterType];

  return (
    <Card
      onClick={onSelect}
      className={`
        group relative p-3 transition-all duration-200 cursor-pointer
        ${isSelected
          ? "border-accent-gold/30 bg-accent-gold/10"
          : "border-transparent hover:bg-obsidian/60"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        {/* Portrait or Icon */}
        {character.portraitUrl ? (
          <div className="flex-shrink-0 w-10 h-10 rounded-sm overflow-hidden bg-obsidian/60">
            <Image
              src={character.portraitUrl}
              alt={character.name}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-obsidian/60 flex items-center justify-center text-lg">
            {typeIcon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className={`
            text-sm font-medium truncate transition-colors
            ${character.isVisible ? "text-text-secondary" : "text-text-muted"}
          `}>
            {character.name}
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs px-1.5 py-0 ${typeColor}`}>
              {character.characterType}
            </Badge>
            {character.faction && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                {character.faction}
              </Badge>
            )}
            {character.level && (
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Lv.{character.level}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Visibility indicator */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleToggleVisibility}
          className={`
            flex-shrink-0 h-8 w-8 p-0
            ${character.isVisible
              ? "text-accent-gold hover:bg-accent-gold/10"
              : "text-text-muted hover:bg-obsidian/60"
            }
          `}
          title={character.isVisible ? "Visible" : "Hidden"}
        >
          {character.isVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Details preview */}
      {(character.class || character.personality) && (
        <div className="mt-2 text-xs text-text-muted line-clamp-2">
          {character.class && <span className="font-medium">{character.class}</span>}
          {character.class && character.personality && " • "}
          {character.personality}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={handleEdit}
          className="h-7 px-2 text-xs text-text-muted hover:text-text-secondary"
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDelete}
          className="h-7 px-2 text-xs text-text-muted hover:text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
