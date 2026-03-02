"use client";

import { useEffect, useCallback } from "react";
import {
  MousePointer2,
  Hand,
  Ruler,
  Square,
} from "lucide-react";
import { cn, shouldIgnoreKeyboardEvent } from "@/shared/lib/utils";
import { useToolMode, useSetToolMode } from "@/features/world-editor/store/tools";
import { useLeftDock } from "../../logic/use-left-dock";

// Re-export types from the new store
type ToolMode = "select" | "pan" | "measure" | "area";

const TOOL_SHORTCUTS: Record<ToolMode, string> = {
  select: "v",
  pan: "h",
  measure: "m",
  area: "a",
};

function getToolModeFromKey(key: string): ToolMode | null {
  const lowerKey = key.toLowerCase();
  const entry = Object.entries(TOOL_SHORTCUTS).find(
    ([, shortcut]) => shortcut === lowerKey
  );
  return (entry?.[0] as ToolMode) ?? null;
}

interface ToolButtonProps {
  mode: ToolMode;
  currentMode: ToolMode;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
  isDockExpanded: boolean;
  onModeChange: (mode: ToolMode) => void;
}

function ToolButton({
  mode,
  currentMode,
  label,
  icon,
  shortcut,
  isDockExpanded,
  onModeChange,
}: ToolButtonProps) {
  const isActive = currentMode === mode;

  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (e.type === 'click' || e.type === 'touchend') {
      onModeChange(mode);
    }
  }, [onModeChange, mode]);

  return (
    <div className="group relative">
      <button
        onClick={handleInteraction}
        onMouseDown={handleInteraction}
        onMouseUp={handleInteraction}
        onTouchStart={handleInteraction}
        onTouchEnd={handleInteraction}
        onTouchMove={handleInteraction}
        type="button"
        className={cn(
          "relative flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-200",
          "text-bone-dark hover:text-accent-gold",
          "hover:bg-iron/50",
          "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
          isActive && "bg-accent-gold/10 text-accent-gold ring-2 ring-accent-gold/50"
        )}
        aria-label={label}
        aria-pressed={isActive}
      >
        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          {icon}
        </span>
        {isDockExpanded && (
          <>
            <span className="text-sm font-display">{label}</span>
            <kbd
              className={cn(
                "ml-auto text-xs px-1.5 py-0.5 rounded",
                "bg-iron/70 text-bone-dark/70 font-mono",
                isActive && "bg-accent-gold/20 text-accent-gold/80"
              )}
            >
              {shortcut.toUpperCase()}
            </kbd>
          </>
        )}
      </button>
      {/* Tooltip - only show when dock is collapsed */}
      {!isDockExpanded && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-obsidian border border-iron rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
          {label} ({shortcut.toUpperCase()})
        </div>
      )}
    </div>
  );
}

interface ToolsPanelProps {
  className?: string;
}

export function ToolsPanel({ className }: ToolsPanelProps) {
  const mode = useToolMode();
  const setMode = useSetToolMode();
  const { isExpanded: isDockExpanded } = useLeftDock();

  const handleModeChange = useCallback(
    (newMode: ToolMode) => {
      setMode(newMode);
    },
    [setMode]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or has data-no-shortcut attribute
      if (shouldIgnoreKeyboardEvent(e)) return;

      const toolMode = getToolModeFromKey(e.key);
      if (toolMode) {
        e.preventDefault();
        setMode(toolMode);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setMode]);

  const tools: Array<{
    mode: ToolMode;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      mode: "select",
      label: "Select",
      icon: <MousePointer2 className="w-full h-full" strokeWidth={2.5} />,
    },
    {
      mode: "pan",
      label: "Pan",
      icon: <Hand className="w-full h-full" strokeWidth={2.5} />,
    },
    {
      mode: "measure",
      label: "Measure",
      icon: <Ruler className="w-full h-full" strokeWidth={2.5} />,
    },
    {
      mode: "area",
      label: "Area",
      icon: <Square className="w-full h-full" strokeWidth={2.5} />,
    },
  ];

  return (
    <div
      className={cn("space-y-1", className)}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Section header - only visible when expanded */}
      {isDockExpanded && (
        <div className="px-3 pb-2 border-b border-iron/30">
          <h3 className="text-xs font-display tracking-wider text-bone-dark/70 uppercase">
            Tools
          </h3>
        </div>
      )}

      {/* Tool buttons */}
      <div className="space-y-0.5">
        {tools.map((tool) => (
          <ToolButton
            key={tool.mode}
            mode={tool.mode}
            currentMode={mode}
            label={tool.label}
            icon={tool.icon}
            shortcut={TOOL_SHORTCUTS[tool.mode]}
            isDockExpanded={isDockExpanded}
            onModeChange={handleModeChange}
          />
        ))}
      </div>
    </div>
  );
}
