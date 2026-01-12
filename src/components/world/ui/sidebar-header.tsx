"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X } from "lucide-react";
import { updateWorldTitle } from "@/actions/worlds";

interface SidebarHeaderProps {
  title: string;
  worldId: string;
  isCollapsed: boolean;
  onTitleUpdate?: (newTitle: string) => void;
}

export function SidebarHeader({ title, worldId, isCollapsed, onTitleUpdate }: SidebarHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditing && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleSave();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editTitle]);

  const handleSave = async () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle || trimmedTitle === title) {
      setEditTitle(title);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateWorldTitle(worldId, trimmedTitle);
      onTitleUpdate?.(trimmedTitle);
      setIsEditing(false);
    } catch (error) {
      setEditTitle(title);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-3 border-b border-border-subtle bg-background-elevated">
      {!isCollapsed && (
        <div className="flex flex-col flex-1 min-w-0">
          {isEditing ? (
            <div ref={containerRef} className="flex items-center gap-2 group">
              <input
                ref={inputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSaving}
                className="flex-1 w-56 text-lg font-display font-semibold text-text-primary leading-tight bg-background-card border-2 border-accent-gold rounded-sm px-2 py-1 outline-none transition-all duration-200 placeholder:text-text-muted/50 focus:border-accent-gold-light disabled:opacity-50"
              />
              <button
                onClick={handleSave}
                disabled={isSaving || !editTitle.trim() || editTitle.trim() === title}
                className="p-1 rounded-sm text-accent-gold hover:text-accent-gold-light hover:bg-background-card-hover transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-accent-gold"
                aria-label="Save title"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-1 rounded-sm text-text-muted hover:text-text-secondary hover:bg-background-card-hover transition-all duration-200 disabled:opacity-30 disabled:hover:bg-transparent"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h2
              onClick={() => setIsEditing(true)}
              className="text-lg font-display font-semibold text-text-primary leading-tight cursor-pointer hover:text-accent-gold transition-colors select-none px-2 py-1 -mx-2 rounded-sm hover:bg-background-card/50"
              title="Click to edit title"
            >
              {title}
            </h2>
          )}
          <span className="text-xs text-text-muted mt-0.5 px-2">World Editor</span>
        </div>
      )}
    </div>
  );
}
