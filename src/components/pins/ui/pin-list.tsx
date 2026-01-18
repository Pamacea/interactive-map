"use client";

import { useState, useMemo } from "react";
import { MapPin, Badge } from "lucide-react";
import { usePins, useSelectedPinId, useSelectPin } from "@/stores/use-pins-store";
import { useSelectedLayerId } from "@/stores/map-store";
import { pinTypeConfig, PinType } from "@/constants/pin-types";
import type { Pin } from "@prisma/client";
import { getLucideIcon } from "@/lib/icon-utils";
import { useMapCenter } from "@/components/world/context/map-context";

interface PinListProps {
  worldId: string;
}

export function PinList({ worldId }: PinListProps) {
  // Use Zustand store directly - already synced by WorldClient
  const pins = usePins();
  const selectedPinId = useSelectedPinId();
  const selectedLayerId = useSelectedLayerId();

  const selectPin = useSelectPin();
  const { centerOnPin } = useMapCenter();

  // Filter state
  const [selectedType, setSelectedType] = useState<PinType | "ALL">("ALL");

  // Filter pins by selected layer and type
  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      // Filter by layer
      if (selectedLayerId && pin.layerId !== selectedLayerId) {
        return false;
      }
      // Filter by type
      if (selectedType !== "ALL" && pin.pinType !== selectedType) {
        return false;
      }
      return true;
    });
  }, [pins, selectedLayerId, selectedType]);

  // Pin type filter options
  const pinTypes = useMemo(() => {
    const types = [
      { value: "ALL" as const, label: "All Pins", icon: "MapPin" },
      ...Object.entries(pinTypeConfig).map(([type, config]) => ({
        value: type as PinType,
        label: config.label,
        icon: config.icon,
      })),
    ];
    return types;
  }, []);

  // Get icon component by name (type-safe)
  const getIconComponent = (iconName: string) => {
    return getLucideIcon(iconName);
  };

  const handlePinClick = (pin: Pin) => {
    selectPin(pin.id);

    // Center the map on the clicked pin
    centerOnPin(pin.id);
  };

  const pinCount = filteredPins.length;
  const totalCount = pins.length;

  return (
    <div className="flex flex-col">
      {/* Filter Dropdown */}
      <div className="mb-3">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as PinType | "ALL")}
          className="w-full h-9 px-3 text-sm bg-background-base border border-border-base rounded-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold cursor-pointer hover:border-border-muted transition-colors"
        >
          {pinTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pin Count Badge */}
      <div className="mb-2 flex items-center gap-2">
        <Badge className="text-xs bg-accent-gold/10 text-accent-gold border-accent-gold/30">
          {pinCount}
          {totalCount > pinCount && ` / ${totalCount}`}
        </Badge>
        <span className="text-xs text-text-muted">
          {selectedType === "ALL" ? "pins" : selectedType.toLowerCase()}
        </span>
      </div>

      {/* Pin List */}
      {filteredPins.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <MapPin className="w-8 h-8 mx-auto mb-2 text-text-muted" />
          <p className="text-sm text-text-muted">No pins found</p>
          <p className="text-xs text-text-muted mt-1">
            {totalCount > 0
              ? "Try a different filter"
              : "Click on the map to add pins"}
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {filteredPins.map((pin) => {
            const isSelected = selectedPinId === pin.id;
            const typeConfig = pinTypeConfig[pin.pinType as PinType];
            const PinIcon = getIconComponent(typeConfig.icon);

            return (
              <div
                key={pin.id}
                onClick={() => handlePinClick(pin)}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-sm
                  transition-all duration-200 cursor-pointer border
                  ${isSelected
                    ? "border-accent-gold/30 bg-accent-gold/10"
                    : "border-transparent hover:bg-background-elevated/80"
                  }
                `}
              >
                {/* Pin Icon */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: pin.color }}
                >
                  <PinIcon className="w-4 h-4 text-white" />
                </div>

                {/* Pin Name */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`
                      text-sm truncate transition-colors
                      ${pin.isVisible ? "text-text-secondary" : "text-text-muted"}
                    `}
                  >
                    {pin.title}
                  </p>
                </div>

                {/* Type Badge */}
                <div
                  className="flex-shrink-0 px-2 py-0.5 rounded-sm text-xs font-medium text-white"
                  style={{ backgroundColor: pin.color }}
                >
                  {typeConfig.label}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
