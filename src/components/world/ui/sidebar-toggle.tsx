import { Menu, X } from "lucide-react";
import { memo } from "react";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SidebarToggle = memo(function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-4 left-4 p-2 bg-background-card/90 backdrop-blur-sm rounded-sm border border-border-subtle text-text-primary hover:bg-background-card-hover transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={isOpen}
      aria-controls="sidebar-panel"
      type="button"
    >
      {isOpen ? (
        <X className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Menu className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
});
