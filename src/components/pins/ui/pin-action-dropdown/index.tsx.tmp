"use client";

import { useDropdownLogic } from "./use-dropdown-logic";
import { DropdownTrigger } from "./dropdown-trigger";
import { DropdownMenu } from "./dropdown-menu";

export interface PinActionDropdownProps {
  worldId: string;
  onAddPin: () => void;
  onTogglePlaceMode: () => void;
  isPlacingMode?: boolean;
  isLayerSelected?: boolean;
}

export function PinActionDropdown({
  worldId: _worldId,
  onAddPin,
  onTogglePlaceMode,
  isPlacingMode = false,
  isLayerSelected = true,
}: PinActionDropdownProps) {
  const {
    isOpen,
    showTooltip,
    setShowTooltip,
    dropdownRef,
    toggleOpen,
    close,
  } = useDropdownLogic();

  const handleAddPin = () => {
    close();
    onAddPin();
  };

  const handleTogglePlaceMode = () => {
    close();
    onTogglePlaceMode();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <DropdownTrigger
        isOpen={isOpen}
        isLayerSelected={isLayerSelected}
        showTooltip={showTooltip}
        onToggle={toggleOpen}
        onShowTooltip={() => setShowTooltip(true)}
        onHideTooltip={() => setShowTooltip(false)}
      />
      <DropdownMenu
        isOpen={isOpen}
        isPlacingMode={isPlacingMode}
        onAddPin={handleAddPin}
        onTogglePlaceMode={handleTogglePlaceMode}
      />
    </div>
  );
}
