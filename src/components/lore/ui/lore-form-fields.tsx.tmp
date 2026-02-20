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
      <h3 className="text-sm font-display font-semibold text-bone">
        {isEditing ? "Edit Lore" : "New Lore"}
      </h3>
      <Button
        size="sm"
        variant="ghost"
        onClick={onClose}
        className="h-7 w-7 p-0 text-bone-dark hover:text-accent-gold hover:bg-obsidian/50"
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
    <div className="p-3 bg-blood/20 border border-blood/50 rounded-sm">
      <p className="text-sm text-bone">{error}</p>
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

// Create a lookup object for category labels
export const categoryLabels: Record<LoreCategory, string> = CATEGORIES.reduce(
  (acc, cat) => ({ ...acc, [cat.value]: cat.label }),
  {} as Record<LoreCategory, string>
);

export { CATEGORIES };
