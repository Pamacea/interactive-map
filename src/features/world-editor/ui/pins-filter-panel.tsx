"use client";

import { Eye, EyeOff } from "lucide-react";
import { usePinTypeFilters, useTogglePinTypeFilter, useShowAllPinTypes, useHideAllPinTypes } from "@/features/pins/store";
import { PinType } from "@/types/pin.type";
import { pinTypeConfig } from "@/constants/pin-types";
import { getLucideIcon } from "@/shared/lib/icon-utils";

export function PinsFilterPanel() {
  const filters = usePinTypeFilters();
  const toggleFilter = useTogglePinTypeFilter();
  const showAllTypes = useShowAllPinTypes();
  const hideAllTypes = useHideAllPinTypes();

  const getPinIcon = (iconName: string) => {
    return getLucideIcon(iconName);
  };

  const allVisible = Object.values(filters).every((v) => v === true);
  const allHidden = Object.values(filters).every((v) => v === false);

  const getPinConfig = (type: (typeof PinType)[keyof typeof PinType]) => {
    return pinTypeConfig[type as unknown as keyof typeof pinTypeConfig];
  };

  return (
    <div className="space-y-3" role="region" aria-label="Pin filters panel">

      {/* Global Actions */}
      <div className="flex gap-2 pl-3 pr-32 pt-3">
        <button
          onClick={showAllTypes}
          disabled={allVisible}
          className="flex-1 px-3 py-2 text-xs font-display font-medium rounded-sm border border-iron bg-obsidian/60 text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:focus:ring-0"
          aria-label="Show all pin types"
          type="button"
        >
          Show All
        </button>
        <button
          onClick={hideAllTypes}
          disabled={allHidden}
          className="flex-1 px-3 py-2 text-xs font-display font-medium rounded-sm border border-iron bg-obsidian/60 text-bone-dark hover:text-accent-gold hover:border-accent-gold/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:focus:ring-0"
          aria-label="Hide all pin types"
          type="button"
        >
          Hide All
        </button>
      </div>

      {/* Filter List */}
      <div className="space-y-1" role="group" aria-label="Pin type filters">
        {Object.entries(filters).map(([type, isVisible]) => {
          const config = getPinConfig(type as (typeof PinType)[keyof typeof PinType]);
          const IconComponent = getPinIcon(config.icon);

          return (
            <button
              key={type}
              onClick={() => toggleFilter(type as (typeof PinType)[keyof typeof PinType])}
              aria-pressed={isVisible}
              aria-label={`${config.label}: ${isVisible ? "visible" : "hidden"}`}
              className={`
                w-full flex items-center gap-3 px-3 py-2 rounded-sm
                border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-accent-gold/50
                ${
                  isVisible
                    ? "bg-obsidian/70 border-iron hover:border-accent-gold/50"
                    : "bg-void border-iron/30 opacity-50 hover:opacity-70"
                }
              `}
              type="button"
            >
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${config.color}20`,
                  border: `1px solid ${config.color}40`,
                }}
                aria-hidden="true"
              >
                <IconComponent
                  className="w-4 h-4"
                  style={{ color: config.color }}
                />
              </div>

              <p
                className={`flex-1 text-left text-sm font-fell ${
                  isVisible ? "text-bone" : "text-bone-dark"
                }`}
              >
                {config.label}
              </p>

              <div
                className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors ${
                  isVisible
                    ? "bg-accent-gold/10 text-accent-gold"
                    : "bg-obsidian/60 text-bone-dark"
                }`}
                aria-hidden="true"
              >
                {isVisible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info text */}
      <div className="px-3 py-2 rounded-sm bg-obsidian/50 border border-iron/30">
        <p className="text-xs text-bone-dark leading-relaxed font-fell">
          Toggle pin types to control which markers appear on your map.
        </p>
      </div>
    </div>
  );
}
