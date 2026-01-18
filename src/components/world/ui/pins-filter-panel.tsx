"use client";

import { Filter, Eye, EyeOff } from "lucide-react";
import { usePinTypeFilters, useTogglePinTypeFilter, useShowAllPinTypes, useHideAllPinTypes } from "@/stores/use-pins-store";
import { PinType } from "@/types/pin.type";
import { pinTypeConfig } from "@/constants/pin-types";
import { getLucideIcon } from "@/lib/icon-utils";

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

  // Convert (typeof PinType)[keyof typeof PinType] to PinType for config lookup
  const getPinConfig = (type: (typeof PinType)[keyof typeof PinType]) => {
    // (typeof PinType)[keyof typeof PinType] and PinType have the same values, just different enum types
    return pinTypeConfig[type as unknown as keyof typeof pinTypeConfig];
  };

  return (
    <div className="space-y-4" role="region" aria-label="Pin filters panel">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated border border-accent-gold/30">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent-gold" aria-hidden="true" />
          <span className="text-xs font-display font-medium text-accent-gold uppercase tracking-wider">
            Pin Filters
          </span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex gap-2 px-1" role="group" aria-label="Filter controls">
        <button
          onClick={showAllTypes}
          disabled={allVisible}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-sm border border-border-subtle bg-background-elevated text-text-primary hover:bg-background-base hover:text-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:focus:ring-0"
          aria-label="Show all pin types"
          type="button"
        >
          Show All
        </button>
        <button
          onClick={hideAllTypes}
          disabled={allHidden}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-sm border border-border-subtle bg-background-elevated text-text-primary hover:bg-background-base hover:text-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold/50 disabled:focus:ring-0"
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
                w-full flex items-center gap-3 px-3 py-2.5 rounded-sm
                border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-accent-gold/50
                ${
                  isVisible
                    ? "bg-background-elevated border-border-subtle hover:border-accent-gold/50"
                    : "bg-background-base border-border-subtle opacity-50 hover:opacity-70"
                }
              `}
              type="button"
            >
              {/* Icon with colored background */}
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

              {/* Type label */}
              <div className="flex-1 text-left">
                <p
                  className={`text-sm font-medium ${
                    isVisible ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {config.label}
                </p>
              </div>

              {/* Visibility indicator */}
              <div
                className={`w-8 h-8 rounded-sm flex items-center justify-center transition-colors ${
                  isVisible
                    ? "bg-accent-gold/10 text-accent-gold"
                    : "bg-background-elevated text-text-muted"
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
      <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
        <p className="text-xs text-text-muted leading-relaxed">
          Toggle pin types to control which markers appear on your map. Hidden
          pins remain in your world but won't be displayed.
        </p>
      </div>
    </div>
  );
}
