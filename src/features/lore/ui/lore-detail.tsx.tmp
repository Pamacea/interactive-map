"use client";

import { Clock, Calendar, Eye, Edit, ArrowLeft } from "lucide-react";
import { LoreEntry } from "@/types/lore.type";
import { useLoreStore } from "@/features/lore/store/use-lore-store";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { MarkdownRenderer } from "./markdown-renderer";
import { categoryLabels } from "./lore-form-fields";

interface LoreDetailProps {
  lore: LoreEntry;
  worldId: string;
}

export function LoreDetail({ lore, worldId: _worldId }: LoreDetailProps) {
  const clearSelection = useLoreStore((state) => state.clearSelection);
  const startEditing = useLoreStore((state) => state.startEditing);
  const selectLore = useLoreStore((state) => state.selectLore);

  const handleEdit = () => {
    selectLore(lore.id);
    startEditing();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSelection}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-sm font-display font-semibold text-text-primary truncate">
            {lore.title}
          </h2>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={handleEdit}
          className="h-8"
        >
          <Edit className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {categoryLabels[lore.category]}
          </Badge>
          {lore.isVisible ? (
            <Badge variant="outline" className="text-xs text-green-500 border-green-500/30">
              <Eye className="w-3 h-3 mr-1" />
              Visible
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-text-muted">
              Hidden
            </Badge>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Created {formatDate(lore.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Updated {formatDate(lore.updatedAt)}</span>
          </div>
        </div>

        {/* Markdown content */}
        <div className="border-t border-border-subtle pt-4">
          <MarkdownRenderer content={lore.content} />
        </div>
      </div>
    </div>
  );
}
