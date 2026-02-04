"use client";

import { BookOpen } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { LoreListCompact } from "@/components/lore/ui/lore-list-compact";
import { LoreForm } from "@/components/lore/ui/lore-form";
import { LoreDetail } from "@/components/lore/ui/lore-detail";
import { useLoreStore } from "@/stores/use-lore-store";

interface LoreModuleProps {
  worldId: string;
}

export function LoreModule({ worldId }: LoreModuleProps) {
  const isCreatingLore = useLoreStore((state) => state.isCreating);
  const isEditingLore = useLoreStore((state) => state.isEditing);
  const selectedLoreId = useLoreStore((state) => state.selectedLoreId);
  const loreEntries = useLoreStore((state) => state.loreEntries);
  const stopCreating = useLoreStore((state) => state.stopCreating);
  const stopEditing = useLoreStore((state) => state.stopEditing);
  const startCreating = useLoreStore((state) => state.startCreating);

  const selectedLore = selectedLoreId
    ? loreEntries.find((lore) => lore.id === selectedLoreId)
    : undefined;

  return (
    <FloatingPanel
      panelId="lore"
      title="Lore"
      icon={<BookOpen className="w-4 h-4" />}
      onAdd={startCreating}
    >
      {isCreatingLore || isEditingLore ? (
        <LoreForm
          worldId={worldId}
          lore={selectedLore}
          onSuccess={() => {
            stopCreating();
            stopEditing();
          }}
        />
      ) : selectedLore ? (
        <LoreDetail lore={selectedLore} worldId={worldId} />
      ) : (
        <LoreListCompact worldId={worldId} />
      )}
    </FloatingPanel>
  );
}
