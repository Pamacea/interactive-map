"use client";

import { Filter, Eye, EyeOff } from "lucide-react";
import { usePinFilters, useToggleFilter, useShowAllTypes, useHideAllTypes } from "@/stores/pin-filters-store";
import { PinTypeEnum } from "@/types/pin.type";
import { pinTypeConfig } from "@/constants/pin-types";
import { PinType } from "@/constants/pin-types";
import * as PinIcons from "lucide-react";

export function PinsFilterPanel() {
  const filters = usePinFilters();
  const toggleFilter = useToggleFilter();
  const showAllTypes = useShowAllTypes();
  const hideAllTypes = useHideAllTypes();

  const getPinIcon = (iconName: string) => {
    const IconComponent = (PinIcons as any)[iconName];
    return IconComponent ? IconComponent : PinIcons.MapPin;
  };

  const allVisible = Object.values(filters).every((v) => v === true);
  const allHidden = Object.values(filters).every((v) => v === false);

  // Convert PinTypeEnum to PinType for config lookup
  const getPinConfig = (type: PinTypeEnum) => {
    // PinTypeEnum and PinType have the same values, just different enum types
    return pinTypeConfig[type as unknown as keyof typeof pinTypeConfig];
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated border border-accent-gold/30">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-accent-gold" />
          <span className="text-xs font-display font-medium text-accent-gold uppercase tracking-wider">
            Pin Filters
          </span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex gap-2 px-1">
        <button
          onClick={showAllTypes}
          disabled={allVisible}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-sm border border-border-subtle bg-background-elevated text-text-primary hover:bg-background-base hover:text-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Show All
        </button>
        <button
          onClick={hideAllTypes}
          disabled={allHidden}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-sm border border-border-subtle bg-background-elevated text-text-primary hover:bg-background-base hover:text-accent-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Hide All
        </button>
      </div>

      {/* Filter List */}
      <div className="space-y-1">
        {Object.entries(filters).map(([type, isVisible]) => {
          const config = getPinConfig(type as PinTypeEnum);
          const IconComponent = getPinIcon(config.icon);

          return (
            <button
              key={type}
              onClick={() => toggleFilter(type as PinTypeEnum)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-sm
                border transition-all duration-200
                ${
                  isVisible
                    ? "bg-background-elevated border-border-subtle hover:border-accent-gold/50"
                    : "bg-background-base border-border-subtle opacity-50 hover:opacity-70"
                }
              `}
            >
              {/* Icon with colored background */}
              <div
                className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${config.color}20`,
                  border: `1px solid ${config.color}40`,
                }}
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
