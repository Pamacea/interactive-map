"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { CharacterList } from "@/components/character/ui/character-list";
import { CharacterForm } from "@/components/character/ui/character-form";
import { CharacterDetail } from "@/components/character/ui/character-detail";
import { useCharacterStore } from "@/stores/use-character-store";
import { getCharactersByWorld } from "@/actions/characters";
import type { Character } from "@prisma/client";

interface CharactersModuleProps {
  worldId: string;
}

export function CharactersModule({ worldId }: CharactersModuleProps) {
  const [characters, setCharactersState] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isCreating = useCharacterStore((state) => state.isCreating);
  const isEditing = useCharacterStore((state) => state.isEditing);
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);
  const stopCreating = useCharacterStore((state) => state.stopCreating);
  const stopEditing = useCharacterStore((state) => state.stopEditing);
  const setCharactersStore = useCharacterStore((state) => state.setCharacters);

  // Fetch characters on mount
  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const data = await getCharactersByWorld(worldId);
        setCharactersState(data);
        setCharactersStore(data);
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacters();
  }, [worldId, setCharactersStore]);

  const selectedCharacter = selectedCharacterId
    ? characters.find((c) => c.id === selectedCharacterId)
    : undefined;

  return (
    <FloatingPanel
      panelId="characters"
      title="Characters"
      icon={<User className="w-4 h-4" />}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-32 text-text-muted">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-gold border-t-transparent" />
        </div>
      ) : isCreating || isEditing ? (
        <CharacterForm
          worldId={worldId}
          character={selectedCharacter}
          onSuccess={() => {
            stopCreating();
            stopEditing();
            // Refetch characters
            getCharactersByWorld(worldId).then((data) => {
              setCharactersState(data);
              setCharactersStore(data);
            });
          }}
          onCancel={() => {
            stopCreating();
            stopEditing();
          }}
        />
      ) : selectedCharacter ? (
        <CharacterDetail
          characterId={selectedCharacter.id}
          worldId={worldId}
          characters={characters}
          onClose={() => useCharacterStore.getState().clearSelection()}
        />
      ) : (
        <CharacterList
          worldId={worldId}
          characters={characters}
          onCreateCharacter={() => {
            getCharactersByWorld(worldId).then((data) => {
              setCharactersState(data);
              setCharactersStore(data);
            });
          }}
        />
      )}
    </FloatingPanel>
  );
}
