import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LoreCategory } from "@/types/lore.type";

interface LoreFormHeaderProps {
  isEditing: boolean;
  onClose: () => void;
}

export function LoreFormHeader({ isEditing, onClose }: LoreFormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-text-secondary">
        {isEditing ? "Edit Lore Entry" : "New Lore Entry"}
      </h3>
      <Button
        size="sm"
        variant="ghost"
        onClick={onClose}
        className="h-8 w-8 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}

interface LoreFormErrorProps {
  error: string | null;
}

export function LoreFormError({ error }: LoreFormErrorProps) {
  if (!error) return null;

  return (
    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-sm">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  );
}

const CATEGORIES: { value: LoreCategory; label: string }[] = [
  { value: "GENERAL", label: "General" },
  { value: "HISTORY", label: "History" },
  { value: "GEOGRAPHY", label: "Geography" },
  { value: "CHARACTERS", label: "Characters" },
  { value: "FACTIONS", label: "Factions" },
  { value: "MAGIC", label: "Magic" },
  { value: "ITEMS", label: "Items" },
  { value: "QUESTS", label: "Quests" },
  { value: "CUSTOM", label: "Custom" },
];

export { CATEGORIES };
