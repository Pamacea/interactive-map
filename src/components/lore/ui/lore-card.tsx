"use client";

import { BookOpen, Clock, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { LoreEntry } from "@/types/lore.type";
import { useLoreStore } from "@/stores/use-lore-store";
import { Button } from "@/components/ui/button";

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
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }
  if (seconds >= intervals.month) {
    const months = Math.floor(seconds / intervals.month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }
  if (seconds >= intervals.week) {
    const weeks = Math.floor(seconds / intervals.week);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  if (seconds >= intervals.day) {
    const days = Math.floor(seconds / intervals.day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  if (seconds >= intervals.hour) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (seconds >= intervals.minute) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

interface LoreCardProps {
  lore: LoreEntry;
  isSelected: boolean;
  onSelect: () => void;
  categoryLabel: string;
}

export function LoreCard({ lore, isSelected, onSelect, categoryLabel }: LoreCardProps) {
  const toggleExpanded = useLoreStore((state) => state.toggleExpanded);
  const startEditing = useLoreStore((state) => state.startEditing);
  const deleteLoreEntryServer = useLoreStore((state) => state.deleteLoreEntryServer);
  const selectLore = useLoreStore((state) => state.selectLore);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectLore(lore.id);
    startEditing();
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${lore.title}"?`)) {
      try {
        await deleteLoreEntryServer(lore.id);
      } catch (error) {
        console.error("Failed to delete lore entry:", error);
        alert(error instanceof Error ? error.message : "Failed to delete lore entry");
      }
    }
  };

  const handleToggleVisibility = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const store = useLoreStore.getState();
      await store.updateLoreEntryServer({
        id: lore.id,
        isVisible: !lore.isVisible,
      });
    } catch (error) {
      console.error("Failed to toggle visibility:", error);
      alert(error instanceof Error ? error.message : "Failed to toggle visibility");
    }
  };

  // Truncate content for preview
  const contentPreview = lore.content.length > 150
    ? lore.content.substring(0, 150) + "..."
    : lore.content;

  const timeAgo = formatTimeAgo(new Date(lore.updatedAt));

  return (
    <div
      onClick={onSelect}
      className={`
        group relative p-3 rounded-sm border transition-all duration-200 cursor-pointer
        ${isSelected
          ? "border-accent-gold/30 bg-accent-gold/10"
          : "border-transparent hover:bg-background-elevated/80"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-sm bg-accent-gold/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-accent-gold" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className={`
            text-sm font-medium truncate transition-colors
            ${lore.isVisible ? "text-text-secondary" : "text-text-muted"}
          `}>
            {lore.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-muted">{categoryLabel}</span>
            <span className="text-xs text-text-muted">•</span>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="w-3 h-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Visibility indicator */}
        <button
          onClick={handleToggleVisibility}
          className={`
            flex-shrink-0 p-1 rounded-sm transition-colors
            ${lore.isVisible
              ? "text-accent-gold hover:bg-accent-gold/10"
              : "text-text-muted hover:bg-background-elevated"
            }
          `}
          title={lore.isVisible ? "Visible" : "Hidden"}
        >
          {lore.isVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Content preview */}
      <p className="text-xs text-text-muted line-clamp-3 mb-2">
        {contentPreview}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
}
