/**
 * Top Bar - Fixed bar at top of screen with world info and actions
 *
 * Layout:
 * - Left: Genesis logo + Back button
 * - Center: World title (editable)
 * - Right: Export, Share, User menu buttons
 *
 * Height: 56px
 * - Flex row, justify-between, items-center
 * - Background with backdrop-blur
 * - Border bottom
 * - z-50 (above all other UI)
 */

import { memo, useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Crown,
  Download,
  Share2,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/shared/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMapExport } from "@/features/export/utils/use-map-export-context";
import { ExportDialog } from "@/features/export/ui/export-dialog";
import { getWorldExportData } from "@/features/export/actions";
import type { WorldExportData } from "@/features/export/actions";

const GENESIS_LOGO = (
  <div className="flex items-center gap-2">
    <div className="relative w-8 h-8 flex items-center justify-center">
      <div className="absolute inset-0 bg-accent-gold/20 rotate-45 rounded-sm" />
      <span className="relative text-accent-gold text-sm font-bold tracking-wider">G</span>
    </div>
    <span className="text-sm font-display font-semibold text-bone tracking-wide">
      GENESIS
    </span>
  </div>
);

export interface TopBarProps {
  worldTitle: string;
  worldId: string;
  isOwner?: boolean;
  canEdit?: boolean;
  className?: string;
}

function ActionMenu({
  worldId,
  isOwner,
  onExport,
}: {
  worldId: string;
  isOwner?: boolean;
  onExport: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setIsOpen(false);
    // TODO: Show toast notification
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* User menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={cn(
          "w-8 h-8 bg-obsidian/80 backdrop-blur-sm rounded-sm border border-iron shadow-lg",
          "flex items-center justify-center transition-all",
          "text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10",
          "focus:outline-none focus:ring-2 focus:ring-accent-gold/50",
          isOpen && "border-accent-gold text-accent-gold bg-accent-gold/10"
        )}
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <User className="w-4 h-4" strokeWidth={2} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full right-0 mt-1 w-48",
            "bg-obsidian/95 backdrop-blur-md border border-iron rounded-sm shadow-xl z-60",
            "overflow-hidden"
          )}
        >
          <div className="p-2 space-y-1">
            {/* Export */}
            <button
              onClick={() => {
                onExport();
                setIsOpen(false);
              }}
              type="button"
              className={cn(
                "w-full px-3 py-2 rounded-sm",
                "flex items-center gap-2 text-left",
                "text-bone-dark hover:text-accent-gold hover:bg-iron/50",
                "transition-colors"
              )}
            >
              <Download className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Export Map</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              type="button"
              className={cn(
                "w-full px-3 py-2 rounded-sm",
                "flex items-center gap-2 text-left",
                "text-bone-dark hover:text-accent-gold hover:bg-iron/50",
                "transition-colors"
              )}
            >
              <Share2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Share Link</span>
            </button>

            {/* Settings (owner only) */}
            {isOwner && (
              <Link
                href={`/world/${worldId}/settings`}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full px-3 py-2 rounded-sm",
                  "flex items-center gap-2 text-left",
                  "text-bone-dark hover:text-accent-gold hover:bg-iron/50",
                  "transition-colors"
                )}
              >
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Settings</span>
              </Link>
            )}

            {/* Divider */}
            <div className="h-px bg-iron/50 my-1" />

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              type="button"
              className={cn(
                "w-full px-3 py-2 rounded-sm",
                "flex items-center gap-2 text-left",
                "text-bone-dark hover:text-blood hover:bg-blood/10",
                "transition-colors"
              )}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const TopBar = memo(function TopBar({
  worldTitle,
  worldId,
  isOwner = false,
  canEdit = false,
  className,
}: TopBarProps) {
  const { getMapElement } = useMapExport();
  const [exportOpen, setExportOpen] = useState(false);
  const [worldData, setWorldData] = useState<WorldExportData | null>(null);

  // Prevent map interactions when interacting with the top bar
  const handleInteraction = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  }, []);

  const handleExportClick = useCallback(async () => {
    if (!worldData) {
      try {
        const result = await getWorldExportData(worldId);
        if (result.success) {
          setWorldData(result.data);
        }
      } catch (error) {
        console.error("Failed to load world data for export:", error);
      }
    }
    setExportOpen(true);
  }, [worldId, worldData]);

  return (
    <>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 h-14 bg-obsidian/95 backdrop-blur-md border-b border-iron/50",
          "flex items-center justify-between px-4 z-50",
          className
        )}
        onMouseDown={handleInteraction}
        onMouseUp={handleInteraction}
        onClick={handleInteraction}
        onTouchStart={handleInteraction}
        onTouchEnd={handleInteraction}
        onTouchMove={handleInteraction}
      >
        {/* Left: Logo + Back button */}
        <div className="flex items-center gap-3">
          {GENESIS_LOGO}

          <div className="h-6 w-px bg-iron/50" />

          <Link
            href="/worlds"
            className={cn(
              "w-8 h-8 flex items-center justify-center",
              "text-bone-dark hover:text-accent-gold hover:bg-iron/50 rounded-sm",
              "transition-colors"
            )}
            title="Back to worlds"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
          </Link>

          <Link
            href="/explore"
            className={cn(
              "w-8 h-8 flex items-center justify-center",
              "text-bone-dark hover:text-accent-gold hover:bg-iron/50 rounded-sm",
              "transition-colors"
            )}
            title="Explore worlds"
          >
            <Home className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Center: World title */}
        <div className="flex items-center gap-2 px-4 py-2 bg-obsidian/60 rounded-sm border border-iron/50">
          <Crown className="w-4 h-4 text-accent-gold/60 flex-shrink-0" strokeWidth={1.5} />
          <span
            className="text-sm font-display font-medium text-bone max-w-[200px] truncate"
            title={worldTitle}
          >
            {worldTitle}
          </span>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          <ActionMenu
            worldId={worldId}
            isOwner={isOwner}
            onExport={handleExportClick}
          />
        </div>
      </div>

      {/* Export Dialog */}
      {worldData && (
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          worldTitle={worldTitle}
          worldData={worldData}
          mapElement={getMapElement()}
        />
      )}
    </>
  );
});
