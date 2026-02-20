import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/shared/utils";

interface SearchBarCompactProps {
  className?: string;
}

export function SearchBarCompact({ className }: SearchBarCompactProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div
      className={cn(
        "relative flex items-center",
        "bg-background-card",
        "rounded-sm border border-border-subtle",
        "transition-all duration-300",
        isExpanded ? "w-64" : "w-10",
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2.5 text-text-muted hover:text-accent-gold transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>

      {isExpanded && (
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className={cn(
            "flex-1 bg-transparent outline-none",
            "text-text-primary placeholder:text-text-muted text-sm",
            "animate-in fade-in slide-in-from-left-2 duration-200"
          )}
          autoFocus
        />
      )}

      {isExpanded && query && (
        <button
          onClick={() => setQuery("")}
          className="mr-2 text-text-muted hover:text-text-primary"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
