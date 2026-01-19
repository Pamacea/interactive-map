import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconPickerHeaderProps {
  onClose: () => void;
}

export function IconPickerHeader({ onClose }: IconPickerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--color-border-ornate)] p-4">
      <h2 id="icon-picker-title" className="text-lg font-semibold text-text-primary">
        Select Icon
      </h2>
      <button
        onClick={onClose}
        className="text-text-secondary hover:text-accent-gold transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 rounded-sm p-1"
        aria-label="Close icon picker"
        type="button"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}

interface IconPickerSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function IconPickerSearch({ search, onSearchChange, inputRef }: IconPickerSearchProps) {
  return (
    <div className="p-4 border-b border-[var(--color-border-ornate)]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" aria-hidden="true" />
        <label htmlFor="icon-search" className="sr-only">
          Search icons
        </label>
        <input
          id="icon-search"
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search icons..."
          className="w-full pl-10 pr-4 py-2 bg-background-base border border-border-ornate rounded-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
          autoFocus
        />
      </div>
    </div>
  );
}

interface IconPickerFooterProps {
  filteredCount: number;
}

export function IconPickerFooter({ filteredCount }: IconPickerFooterProps) {
  return (
    <div className="border-t border-[var(--color-border-ornate)] p-4 text-xs text-text-muted" role="status">
      {filteredCount} icon{filteredCount !== 1 ? "s" : ""} • Use arrow keys to navigate, Enter to select, Escape to close
    </div>
  );
}
