"use client";

import { useState } from "react";
import { MapPin, ChevronDown, Plus, Crosshair, FileText, Copy, Lock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
    // TODO: Implement CSV import functionality
  };

  const handleDuplicateExisting = () => {
    setIsOpen(false);
    // TODO: Implement duplicate existing functionality
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <button
            disabled={!isLayerSelected}
            className={`
              w-full flex items-center justify-center gap-2 px-3 py-2 rounded-sm
              transition-all duration-200
              bg-background-elevated border border-border-subtle
              ${isLayerSelected
                ? "hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
              }
              ${isOpen ? "border-accent-gold/50 bg-accent-gold/10" : "text-text-secondary"}
            `}
            title={isLayerSelected ? "Add Pin" : undefined}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Add Pin</span>
            {isLayerSelected && (
              <ChevronDown
                className={`
                  w-4 h-4 transition-transform duration-200
                  ${isOpen ? "rotate-180" : ""}
                `}
              />
            )}
            {!isLayerSelected && <Lock className="w-3 h-3 ml-auto" />}
          </button>
        </div>
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
          <div className="flex-1 text-left">
            <span>Click on Map</span>
            {isPlacingMode && (
              <span className="ml-2 text-xs text-accent-gold-light">(Active)</span>
            )}
          </div>
        </DropdownMenuItem>

        {/* Placeholder: Import from CSV */}
        <DropdownMenuItem 
          onClick={handleImportCSV}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-secondary hover:bg-background-elevated transition-colors cursor-not-allowed opacity-60"
          disabled
        >
          <FileText className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1 text-left">
            <span>Import from CSV</span>
            <span className="ml-2 text-xs text-text-muted">(Coming soon)</span>
          </div>
        </DropdownMenuItem>

        {/* Placeholder: Duplicate Existing */}
        <DropdownMenuItem 
          onClick={handleDuplicateExisting}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text-secondary hover:bg-background-elevated transition-colors cursor-not-allowed opacity-60"
          disabled
        >
          <Copy className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1 text-left">
            <span>Duplicate Existing</span>
            <span className="ml-2 text-xs text-text-muted">(Coming soon)</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
