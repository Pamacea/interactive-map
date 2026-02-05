"use client";

import Link from "next/link";
import { memo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowLeft,
  Home,
  Crown,
  Download,
  Minus,
  Plus,
  RotateCcw,
  Layers,
  BookOpen,
  Filter,
  Settings2,
  Users,
  User,
  GripVertical,
  Clock,
  MessageSquare,
  History,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScale, useZoom, useMapStore } from "@/stores/map-store";
import { ExportDialog } from "@/components/export/ui/export-dialog";
import { getWorldExportData } from "@/actions/export";
import type { WorldExportData } from "@/actions/export";
import { usePanelState, useTogglePanel } from "@/store/use-floating-panels-store";
import type { FloatingPanelId } from "@/store/use-floating-panels-store";

const SCALE_OPTIONS = ["1:1000", "1:500", "1:100"] as const;

interface FloatingHeaderProps {
  worldTitle: string;
  worldId: string;
  mapElement?: HTMLElement | null;
}

function ToolButton({
  children,
  isActive,
  onClick,
  disabled,
  title,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button"
      className={cn(
        "w-8 h-8 bg-obsidian/80 backdrop-blur-sm rounded-sm border border-iron shadow-lg flex items-center justify-center transition-all",
        "text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10",
        "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
        isActive && "border-accent-gold text-accent-gold bg-accent-gold/10",
        disabled && "opacity-50"
      )}
      title={title}
      aria-label={ariaLabel}
    >
      <span suppressHydrationWarning>{children}</span>
    </button>
  );
}

interface DockButtonProps {
  id: FloatingPanelId;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function DockButton({ id, icon, label, isActive }: DockButtonProps) {
  const togglePanel = useTogglePanel();

  return (
    <button
      onClick={() => togglePanel(id)}
      type="button"
      className={cn(
        "w-8 h-8 bg-obsidian/80 backdrop-blur-sm rounded-sm border border-iron shadow-lg flex items-center justify-center transition-all",
        "text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10",
        "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
        isActive && "border-accent-gold text-accent-gold bg-accent-gold/10"
      )}
      title={isActive ? `Hide ${label}` : `Show ${label}`}
      aria-label={isActive ? `Hide ${label}` : `Show ${label}`}
      aria-pressed={isActive}
    >
      <span suppressHydrationWarning>{icon}</span>
    </button>
  );
}

function ScaleAndZoom() {
  const mapScale = useScale();
  const setScale = useMapStore((state) => state.setScale);
  const currentScale = useZoom();
  const zoomIn = useMapStore((state) => state.zoomIn);
  const zoomOut = useMapStore((state) => state.zoomOut);
  const resetZoom = useMapStore((state) => state.resetZoom);
  const [scaleDropdownOpen, setScaleDropdownOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect());
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Zoom out */}
      <ToolButton onClick={zoomOut} title="Zoom out" aria-label="Zoom out">
        <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </ToolButton>

      {/* Reset */}
      <ToolButton onClick={resetZoom} title="Reset zoom" aria-label="Reset zoom">
        <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
      </ToolButton>

      {/* Zoom in */}
      <ToolButton onClick={zoomIn} title="Zoom in" aria-label="Zoom in">
        <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
      </ToolButton>

      {/* Separator */}
      <div className="w-px h-4 bg-iron/50 mx-1" />

      {/* Scale selector */}
      <div className="relative" ref={buttonRef}>
        <button
          onClick={() => { updatePosition(); setScaleDropdownOpen(!scaleDropdownOpen); }}
          onMouseEnter={() => { updatePosition(); setScaleDropdownOpen(true); }}
          className={cn(
            "px-2 py-1 bg-obsidian/70 border border-iron/50 rounded-sm flex items-center gap-1 hover:border-accent-gold/30 transition-colors",
            scaleDropdownOpen && "border-accent-gold/50"
          )}
          title="Change map scale"
          aria-label="Change map scale"
          aria-expanded={scaleDropdownOpen}
        >
          <span className="text-xs font-display font-medium text-bone-dark">
            {mapScale}
          </span>
        </button>

        {/* Scale dropdown via Portal */}
        {scaleDropdownOpen && buttonRect &&
          createPortal(
            <div
              className="fixed bg-obsidian/95 backdrop-blur-md border border-iron rounded-sm overflow-hidden shadow-xl z-[50] p-1"
              style={{
                top: buttonRect.bottom + 8,
                left: buttonRect.left,
              }}
              onClick={() => setScaleDropdownOpen(false)}
              onMouseLeave={() => setScaleDropdownOpen(false)}
            >
              {SCALE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => { setScale(option); setScaleDropdownOpen(false); }}
                  className={cn(
                    "w-full px-2 py-1.5 text-xs font-display transition-colors text-left rounded-sm hover:bg-obsidian whitespace-nowrap",
                    mapScale === option
                      ? "bg-accent-gold/20 text-accent-gold font-medium"
                      : "text-bone-dark"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>

      {/* Zoom level indicator */}
      <div className="px-2 py-0.5 bg-obsidian/70 border border-iron/50 rounded-sm">
        <span className="text-xs font-display font-semibold text-accent-gold min-w-[2rem] text-center">
          {Math.round(currentScale * 100)}%
        </span>
      </div>
    </div>
  );
}

export const FloatingHeader = memo(function FloatingHeader({
  worldTitle,
  worldId,
  mapElement,
}: FloatingHeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [worldData, setWorldData] = useState<WorldExportData | null>(null);

  // Panel states
  const layersPanel = usePanelState("layers");
  const lorePanel = usePanelState("lore");
  const charactersPanel = usePanelState("characters");
  const filtersPanel = usePanelState("filters");
  const propertiesPanel = usePanelState("properties");
  const membersPanel = usePanelState("members");
  const activityPanel = usePanelState("activity");
  const commentsPanel = usePanelState("comments");
  const versionsPanel = usePanelState("versions");
  const importPanel = usePanelState("import");

  const handleExportClick = async () => {
    if (!worldData) {
      setLoading(true);
      try {
        const result = await getWorldExportData(worldId);
        if (result.success) {
          setWorldData(result.data);
        }
      } catch {
        // Handle error silently
      }
      setLoading(false);
    }
    setExportOpen(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-30 w-1/2">
      <div className="relative bg-obsidian/80 backdrop-blur-md rounded-sm border border-iron shadow-xl overflow-hidden group hover:border-accent-gold/50 transition-all duration-300">
        {/* Ornate gold corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-gold/40 group-hover:border-accent-gold transition-colors pointer-events-none" />

        {/* Cracked pattern overlay */}
        <div className="absolute inset-0 bg-crack-pattern opacity-[0.03] pointer-events-none" />

        <div className="relative p-2 flex items-center gap-2 py-3 px-4 flex-wrap" suppressHydrationWarning>
          {/* Grip handle */}
          <div className="flex items-center gap-1 pr-3 border-r border-iron/50">
            <span className="text-accent-gold/30 text-xs">ᛟ</span>
            <GripVertical className="w-4 h-4 text-bone-dark/60" />
          </div>

          {/* Back | Home */}
          <div className="flex items-center gap-1 border-r border-iron/50 pr-3">
            <Link
              href="/worlds"
              className="w-8 h-8 bg-obsidian/80 backdrop-blur-sm rounded-sm border border-iron shadow-lg flex items-center justify-center transition-all text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
              title="Back to worlds"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            </Link>

            <Link
              href="/explore"
              className="w-8 h-8 bg-obsidian/80 backdrop-blur-sm rounded-sm border border-iron shadow-lg flex items-center justify-center transition-all text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 focus:outline-none focus:ring-2 focus:ring-accent-gold/50"
              title="Home"
            >
              <Home className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>

          {/* World Title Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-obsidian/60 rounded-sm border border-iron/50">
            <Crown className="w-3.5 h-3.5 text-accent-gold/60 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-xs font-display font-medium text-bone max-w-[120px] truncate" title={worldTitle}>
              {worldTitle}
            </span>
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-iron/50" />

          {/* Panel buttons */}
          <div className="flex items-center gap-1 border-r border-iron/50 pr-3">
            <DockButton
              id="layers"
              icon={<Layers className="w-4 h-4" />}
              label="Layers"
              isActive={layersPanel.isVisible}
            />
            <DockButton
              id="lore"
              icon={<BookOpen className="w-4 h-4" />}
              label="Lore"
              isActive={lorePanel.isVisible}
            />
            <DockButton
              id="characters"
              icon={<User className="w-4 h-4" />}
              label="Characters"
              isActive={charactersPanel.isVisible}
            />
            <DockButton
              id="filters"
              icon={<Filter className="w-4 h-4" />}
              label="Filters"
              isActive={filtersPanel.isVisible}
            />
            <DockButton
              id="properties"
              icon={<Settings2 className="w-4 h-4" />}
              label="Properties"
              isActive={propertiesPanel.isVisible}
            />
            <DockButton
              id="members"
              icon={<Users className="w-4 h-4" />}
              label="Members"
              isActive={membersPanel.isVisible}
            />
            <DockButton
              id="activity"
              icon={<Clock className="w-4 h-4" />}
              label="Activity"
              isActive={activityPanel.isVisible}
            />
            <DockButton
              id="comments"
              icon={<MessageSquare className="w-4 h-4" />}
              label="Comments"
              isActive={commentsPanel.isVisible}
            />
            <DockButton
              id="versions"
              icon={<History className="w-4 h-4" />}
              label="Version History"
              isActive={versionsPanel.isVisible}
            />
            <DockButton
              id="import"
              icon={<Upload className="w-4 h-4" />}
              label="Import"
              isActive={importPanel.isVisible}
            />
          </div>

          {/* Separator */}
          <div className="w-px h-6 bg-iron/50" />

          {/* Export */}
          <ToolButton
            onClick={handleExportClick}
            disabled={loading}
            title="Export map"
            aria-label="Export map"
          >
            <Download className="w-4 h-4" strokeWidth={2} />
          </ToolButton>

          {/* Separator */}
          <div className="w-px h-6 bg-iron/50" />

          {/* Scale & Zoom controls */}
          <ScaleAndZoom />
        </div>
      </div>

      {/* Export Dialog */}
      {worldData && (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          worldTitle={worldTitle}
          worldData={worldData}
          mapElement={mapElement}
        />
      )}
    </div>
  );
});
