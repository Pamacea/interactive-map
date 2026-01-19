import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchEmptyStateProps {
  query: string;
}

export function SearchEmptyState({ query }: SearchEmptyStateProps) {
  return (
    <div className="flex flex-col gap-6 py-8 text-center">
      <p className="text-sm text-text-muted">
        Start typing to search pins and lore entries
      </p>
      <div className="flex flex-col gap-3">
        <KeyboardShortcut keys="Ctrl + K" description="to open search" />
        <KeyboardShortcut keys="Tab" description="to navigate tabs" />
        <KeyboardShortcut keys="Enter" description="to select result" />
        <KeyboardShortcut keys="Esc" description="to close" />
      </div>
    </div>
  );
}

interface KeyboardShortcutProps {
  keys: string;
  description: string;
}

function KeyboardShortcut({ keys, description }: KeyboardShortcutProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <kbd className="px-2 py-1 bg-background-elevated border border-border-subtle rounded">
        {keys}
      </kbd>
      <span>{description}</span>
    </div>
  );
}

export function SearchLoadingState() {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <Loader2 className="w-6 h-6 animate-spin text-accent-gold" />
      <span className="text-sm text-text-muted">Searching...</span>
    </div>
  );
}

interface SearchErrorStateProps {
  error: string;
}

export function SearchErrorState({ error }: SearchErrorStateProps) {
  return (
    <div className="py-8 text-center">
      <p className="text-sm text-text-destructive">{error}</p>
    </div>
  );
}

interface SearchNoResultsProps {
  query: string;
}

export function SearchNoResults({ query }: SearchNoResultsProps) {
  return (
    <div className="flex flex-col gap-2 py-8 text-center">
      <p className="text-sm text-text-muted">
        No results found for &quot;{query}&quot;
      </p>
      <p className="text-xs text-text-muted">
        Try different keywords or check your filters
      </p>
    </div>
  );
}
