"use client";

import { useMemo, useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { LoreListCompact } from "@/components/lore/ui/lore-list-compact";
import { LoreForm } from "@/components/lore/ui/lore-form";
import { LoreDetail } from "@/components/lore/ui/lore-detail";
import { useLoreStore } from "@/stores/use-lore-store";
import { usePanelState, useHidePanel } from "@/store/use-floating-panels-store";
import { getLoreEntriesByWorld } from "@/actions/lore";
import type { LoreEntry } from "@/types/lore.type";

interface LoreModuleProps {
  worldId: string;
}

/**
 * LoreModule - Floating panel for world lore/wiki
 *
 * Features:
 * - Lazy loading (only fetches when visible)
 * - Auto-hides when no lore entries exist
 * - Create/edit/view modes
 * - Linked to world context
 */
export function LoreModule({ worldId }: LoreModuleProps) {
  const { isVisible } = usePanelState("lore");
  const hidePanel = useHidePanel();
  const [loreEntries, setLoreEntriesState] = useState<LoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Store selectors - only subscribe when visible to prevent re-renders
  const isCreatingLore = useLoreStore((state) => state.isCreating);
  const isEditingLore = useLoreStore((state) => state.isEditing);
  const selectedLoreId = useLoreStore((state) => state.selectedLoreId);
  const storeLoreEntries = useLoreStore((state) => state.loreEntries);
  const stopCreating = useLoreStore((state) => state.stopCreating);
  const stopEditing = useLoreStore((state) => state.stopEditing);
  const startCreating = useLoreStore((state) => state.startCreating);
  const setLoreStore = useLoreStore((state) => state.setLoreEntries);

  // Fetch lore entries when panel becomes visible
  useEffect(() => {
    if (!isVisible || hasLoaded) return;

    const fetchLoreEntries = async () => {
      setIsLoading(true);
      try {
        const data = await getLoreEntriesByWorld(worldId);
        setLoreEntriesState(data);
        setLoreStore(data);
        setHasLoaded(true);

        // Auto-hide panel if no lore entries and not creating/editing
        if (data.length === 0 && !isCreatingLore && !isEditingLore) {
          hidePanel("lore");
        }
      } catch (error) {
        console.error("Failed to fetch lore entries:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoreEntries();
  }, [worldId, isVisible, hasLoaded, setLoreStore, isCreatingLore, isEditingLore, hidePanel]);

  // Refetch callback for after mutations
  const refetchLoreEntries = useCallback(async () => {
    try {
      const data = await getLoreEntriesByWorld(worldId);
      setLoreEntriesState(data);
      setLoreStore(data);

      // Auto-hide panel if no lore entries after mutation
      if (data.length === 0) {
        hidePanel("lore");
      }
    } catch (error) {
      console.error("Failed to refetch lore entries:", error);
    }
  }, [worldId, setLoreStore, hidePanel]);

  // Success handler that refetches data
  const handleSuccess = useCallback(async () => {
    stopCreating();
    stopEditing();
    await refetchLoreEntries();
  }, [stopCreating, stopEditing, refetchLoreEntries]);

  // Use store entries if available, otherwise use local state
  const entries = storeLoreEntries.length > 0 ? storeLoreEntries : loreEntries;

  // Memoize selected lore to prevent unnecessary lookups
  const selectedLore = useMemo(() => {
    if (!selectedLoreId) return undefined;
    return entries.find((lore) => lore.id === selectedLoreId);
  }, [selectedLoreId, entries]);

  // Don't render content if not visible (saves rendering cost)
  const shouldRenderContent = isVisible || isCreatingLore || isEditingLore;

  return (
    <FloatingPanel
      panelId="lore"
      title="Lore"
      icon={<BookOpen className="w-4 h-4" />}
      onAdd={startCreating}
    >
      {shouldRenderContent && (
        <>
          {isLoading ? (
            <div className="flex items-center justify-center h-32 text-bone-dark">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent-gold border-t-transparent" />
            </div>
          ) : isCreatingLore || isEditingLore ? (
            <LoreForm
              worldId={worldId}
              lore={selectedLore}
              onSuccess={handleSuccess}
              onCancel={() => {
                stopCreating();
                stopEditing();
              }}
            />
          ) : selectedLore ? (
            <LoreDetail lore={selectedLore} worldId={worldId} />
          ) : (
            <LoreListCompact worldId={worldId} />
          )}
        </>
      )}
    </FloatingPanel>
  );
}
