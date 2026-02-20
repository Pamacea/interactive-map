"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { User } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { CharacterListCompact } from "@/features/characters/ui";
import { CharacterForm } from "@/features/characters/ui";
import { CharacterDetail } from "@/features/characters/ui";
import { useCharacterStore } from "@/features/characters/store";
import { getCharactersByWorld } from "@/features/characters/actions";
import { usePanelState, useHidePanel } from "@/features/world-editor/store/use-floating-panels-store";
import type { Character } from "@prisma/client";

interface CharactersModuleProps {
  worldId: string;
}

/**
 * CharactersModule - Floating panel for world characters
 *
 * Features:
 * - Lazy loading (only fetches when visible)
 * - Optimistic updates
 * - Auto-hides when no characters exist
 * - Cleanup on unmount
 */
export function CharactersModule({ worldId }: CharactersModuleProps) {
  const { isVisible } = usePanelState("characters");
  const hidePanel = useHidePanel();
  const [characters, setCharactersState] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const isCreating = useCharacterStore((state) => state.isCreating);
  const isEditing = useCharacterStore((state) => state.isEditing);
  const selectedCharacterId = useCharacterStore((state) => state.selectedCharacterId);
  const startCreating = useCharacterStore((state) => state.startCreating);
  const stopCreating = useCharacterStore((state) => state.stopCreating);
  const stopEditing = useCharacterStore((state) => state.stopEditing);
  const setCharactersStore = useCharacterStore((state) => state.setCharacters);

  // Only fetch when panel becomes visible
  useEffect(() => {
    if (!isVisible || hasLoaded) return;

    const fetchCharacters = async () => {
      setIsLoading(true);
      try {
        const data = await getCharactersByWorld(worldId);
        setCharactersState(data);
        setCharactersStore(data);
        setHasLoaded(true);

        // Auto-hide panel if no characters and not creating/editing
        if (data.length === 0 && !isCreating && !isEditing) {
          hidePanel("characters");
        }
      } catch (error) {
        console.error("Failed to fetch characters:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCharacters();
  }, [worldId, isVisible, hasLoaded, setCharactersStore, isCreating, isEditing, hidePanel]);

  // Refetch callback for after mutations
  const refetchCharacters = useCallback(async () => {
    try {
      const data = await getCharactersByWorld(worldId);
      setCharactersState(data);
      setCharactersStore(data);

      // Auto-hide panel if no characters after mutation
      if (data.length === 0) {
        hidePanel("characters");
      }
    } catch (error) {
      console.error("Failed to refetch characters:", error);
    }
  }, [worldId, setCharactersStore, hidePanel]);

  // Memoize selected character
  const selectedCharacter = useMemo(() => {
    if (!selectedCharacterId) return undefined;
    return characters.find((c) => c.id === selectedCharacterId);
  }, [selectedCharacterId, characters]);

  // Success handler that refetches data
  const handleSuccess = useCallback(async () => {
    stopCreating();
    stopEditing();
    await refetchCharacters();
  }, [stopCreating, stopEditing, refetchCharacters]);

  // Cancel handler
  const handleCancel = useCallback(() => {
    stopCreating();
    stopEditing();
  }, [stopCreating, stopEditing]);

  // Close handler
  const handleClose = useCallback(() => {
    useCharacterStore.getState().clearSelection();
  }, []);

  return (
    <FloatingPanel
      panelId="characters"
      title="Characters"
      icon={<User className="w-4 h-4" />}
      onAdd={startCreating}
    >
      {isVisible && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-bone-dark">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-gold border-t-transparent" />
            </div>
          ) : isCreating || isEditing ? (
            <CharacterForm
              worldId={worldId}
              character={selectedCharacter}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          ) : selectedCharacter ? (
            <CharacterDetail
              characterId={selectedCharacter.id}
              worldId={worldId}
              characters={characters}
              onClose={handleClose}
            />
          ) : (
            <CharacterListCompact worldId={worldId} characters={characters} />
          )}
        </>
      )}
    </FloatingPanel>
  );
}
