import { Menu, X } from "lucide-react";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="absolute top-4 left-4 p-2 bg-background-card/90 backdrop-blur-sm rounded-sm border border-border-subtle text-text-primary hover:bg-background-card-hover transition-colors z-10"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}
