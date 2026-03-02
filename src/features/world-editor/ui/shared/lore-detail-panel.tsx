"use client";

import * as React from "react";
import { X, BookOpen, Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/shared/lib/format";

interface LoreDetailPanelProps {
  loreId: string;
  worldId: string;
  open: boolean;
  onClose: () => void;
}

export function LoreDetailPanel({
  loreId,
  worldId,
  open,
  onClose,
}: LoreDetailPanelProps) {
  const { data: lore, isLoading } = useQuery({
    queryKey: ["lore", loreId],
    queryFn: async () => {
      const { getLoreEntryById } = await import("@/features/lore");
      return getLoreEntryById(loreId);
    },
    enabled: open && !!loreId,
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

  const isOwner = lore?.userId === world?.userId;

  return (
    <div className="fixed top-0 right-0 h-full w-80 bg-obsidian/95 backdrop-blur-sm border-l border-iron shadow-xl z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-iron">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-sm font-medium text-text-primary">Lore Entry</span>
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
        ) : !lore ? (
          <p className="text-sm text-text-muted text-center py-8">
            Lore entry not found
          </p>
        ) : (
          <>
            {/* Title & Meta */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{lore.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300">
                  {lore.category}
                </span>
                {lore.isPublic ? (
                  <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-300 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    Public
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-500/20 text-gray-300 flex items-center gap-1">
                    <EyeOff className="w-3 h-3" />
                    Private
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">Content</h4>
              <div className="text-sm text-text-secondary whitespace-pre-wrap prose prose-invert max-h-40 overflow-y-auto">
                {lore.content}
              </div>
            </div>

            {/* Tags */}
            {lore.tags && lore.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-text-secondary mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {lore.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 rounded-xs bg-purple-500/20 text-purple-300 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-text-muted space-y-1">
              <div className="flex justify-between">
                <span>Created:</span>
                <span>{lore.createdAt ? formatDate(new Date(lore.createdAt)) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>{lore.updatedAt ? formatDate(new Date(lore.updatedAt)) : "N/A"}</span>
              </div>
            </div>

            {/* Actions */}
            {isOwner && (
              <div className="pt-4 border-t border-border-subtle">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.location.href = `/world/${worldId}/lore/${lore.slug}`;
                  }}
                >
                  Edit Entry
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
