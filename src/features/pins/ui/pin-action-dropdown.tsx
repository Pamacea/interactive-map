"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Plus, Crosshair, FileText, Copy, Lock } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/ui/dropdown-menu";
import { CSVImportDialog } from "./csv-import-dialog";
import { duplicatePin } from "@/features/pins/actions/duplicate";

export interface PinActionDropdownProps {
  worldId: string;
  onAddPin: () => void;
  onTogglePlaceMode: () => void;
  isPlacingMode?: boolean;
  isLayerSelected?: boolean;
}

export function PinActionDropdown({
  worldId,
  onAddPin,
  onTogglePlaceMode,
  isPlacingMode = false,
  isLayerSelected = true,
}: PinActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);

  const handleAddPin = () => {
    setIsOpen(false);
    onAddPin();
  };

  const handleTogglePlaceMode = () => {
    setIsOpen(false);
    onTogglePlaceMode();
  };

  const handleImportCSV = () => {
    setIsOpen(false);
    setCsvDialogOpen(true);
  };

  const handleDuplicateExisting = async () => {
    setIsOpen(false);
    // Get the currently selected pin from localStorage or context
    // For now, this requires integration with the pin selection system
    // The duplicate action is typically called from a selected pin's context menu
    console.log("Duplicate: Use pin-action from pin-marker context menu");
  };

  const handleCSVDialogSuccess = () => {
    // Trigger refresh or callback if needed
    setCsvDialogOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={!isLayerSelected}
          className="w-full justify-start"
        >
          <MapPin className="w-4 h-4" />
          <span>Add Pin</span>
          {isLayerSelected && (
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          )}
          {!isLayerSelected && <Lock className="w-3 h-3" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="start" 
        className="w-full bg-background-card border border-border-subtle rounded-sm shadow-lg overflow-hidden"
      >
        {/* Primary Action: Add Pin (opens form modal) */}
        <DropdownMenuItem 
          onClick={handleAddPin}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-accent-gold font-medium hover:bg-accent-gold/10 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span>Add Pin</span>
        </DropdownMenuItem>

        {/* Secondary Action: Place Pin Mode (click-to-place on map) */}
        <DropdownMenuItem 
          onClick={handleTogglePlaceMode}
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary
            hover:text-accent-gold hover:bg-accent-gold/10 transition-colors cursor-pointer
            ${isPlacingMode ? "bg-accent-gold/20 text-accent-gold" : ""}
          `}
        >
          <Crosshair className="w-4 h-4 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1">
            <span>Click on Map</span>
            {isPlacingMode && (
              <span className="text-xs text-accent-gold-light">(Active)</span>
            )}
          </div>
        </DropdownMenuItem>

        {/* Import from CSV */}
        <DropdownMenuItem
          onClick={handleImportCSV}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-background-elevated transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 flex-shrink-0" />
          <span>Import from CSV</span>
        </DropdownMenuItem>

        {/* Duplicate Existing */}
        <DropdownMenuItem
          onClick={handleDuplicateExisting}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary hover:bg-background-elevated transition-colors cursor-pointer"
        >
          <Copy className="w-4 h-4 flex-shrink-0" />
          <span>Duplicate Existing (use pin context menu)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* CSV Import Dialog */}
      <CSVImportDialog
        worldId={worldId}
        open={csvDialogOpen}
        onClose={() => setCsvDialogOpen(false)}
        onSuccess={handleCSVDialogSuccess}
      />
    </DropdownMenu>
  );
}
