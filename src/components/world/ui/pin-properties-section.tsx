import { getPinTypeOptions } from "@/constants/pin-types";
import { PIN_ICONS, getIconByName, getUniqueCategories } from "@/constants/pin-icons";
import { Switch } from "@/components/ui/switch";
import * as PinIcons from "lucide-react";
import type { Pin } from "@prisma/client";
import { useState } from "react";

interface PinPropertiesSectionProps {
  pin: Pin;
  formState: {
    title: string;
    description: string;
    pinType: Pin["pinType"];
    icon: string | null;
    size: number;
    color: string;
    opacity: number;
    isVisible: boolean;
    minZoom: number;
    maxZoom: number;
  };
  isUpdating: boolean;
  onUpdate: <K extends keyof Pin>(field: K, value: Pin[K]) => void;
}

export function PinPropertiesSection({
  pin,
  formState,
  isUpdating,
  onUpdate,
}: PinPropertiesSectionProps) {
  const pinTypeOptions = getPinTypeOptions();
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [showIconDropdown, setShowIconDropdown] = useState(false);

  const iconCategories = getUniqueCategories();

  const getPinIcon = (iconName: string) => {
    const IconComponent = (PinIcons as any)[iconName];
    return IconComponent ? IconComponent : PinIcons.MapPin;
  };

  const filteredIcons = PIN_ICONS.filter((icon) => {
    const matchesSearch =
      icon.label.toLowerCase().includes(iconSearchTerm.toLowerCase()) ||
      icon.name.toLowerCase().includes(iconSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const CurrentIconComponent = getPinIcon(formState.icon || "map-pin");

  const CurrentPinTypeIcon = getPinIcon(
    pinTypeOptions.find((opt) => opt.value === pin.pinType)?.icon || "MapPin"
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-accent-gold/30">
        <CurrentPinTypeIcon className="w-4 h-4 text-accent-gold" />
        <span className="text-xs font-display font-medium text-accent-gold uppercase tracking-wider">
          Pin Properties
        </span>
      </div>

      <div className="space-y-3">
        {/* Title Input */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <label className="block text-xs text-text-muted mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={formState.title}
            onChange={(e) => {
              const title = e.target.value;
              // Validate: non-empty and max 200 characters
              if (title.trim().length > 0 && title.length <= 200) {
                onUpdate("title", title);
              }
            }}
            disabled={isUpdating}
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none disabled:opacity-50"
            placeholder="Enter pin title..."
            maxLength={200}
          />
        </div>

        {/* Description Textarea */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <label className="block text-xs text-text-muted mb-1.5">
            Description
          </label>
          <textarea
            value={formState.description}
            onChange={(e) => {
              const description = e.target.value;
              // Validate: max 5000 characters
              if (description.length <= 5000) {
                onUpdate("description", description);
              }
            }}
            disabled={isUpdating}
            rows={3}
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none resize-none disabled:opacity-50"
            placeholder="Enter pin description..."
            maxLength={5000}
          />
        </div>

        {/* Pin Type Dropdown */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <label className="block text-xs text-text-muted mb-1.5">
            Pin Type
          </label>
          <select
            value={formState.pinType}
            onChange={(e) => onUpdate("pinType", e.target.value as Pin["pinType"])}
            disabled={isUpdating}
            className="w-full bg-transparent text-sm text-text-primary focus:outline-none disabled:opacity-50"
          >
            {pinTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Icon Selection Dropdown */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <label className="block text-xs text-text-muted mb-1.5">
            Icon
          </label>

          <div className="relative">
            {/* Icon Selector Button */}
            <button
              type="button"
              onClick={() => setShowIconDropdown(!showIconDropdown)}
              disabled={isUpdating}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded bg-background-base border border-border-subtle hover:border-accent-gold/50 transition-colors disabled:opacity-50"
            >
              <CurrentIconComponent className="w-4 h-4 text-accent-gold" />
              <span className="text-sm text-text-primary flex-1 text-left">
                {PIN_ICONS.find((i) => i.name === formState.icon)?.label ||
                  "Default Icon"}
              </span>
              <PinIcons.ChevronDown
                className={`w-4 h-4 text-text-muted transition-transform ${
                  showIconDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Icon Dropdown Panel */}
            {showIconDropdown && (
              <div className="absolute z-50 mt-2 w-full max-h-80 overflow-y-auto rounded-lg bg-background-elevated border border-border-subtle shadow-lg">
                {/* Search Input */}
                <div className="sticky top-0 bg-background-elevated border-b border-border-subtle p-2">
                  <div className="relative">
                    <PinIcons.Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={iconSearchTerm}
                      onChange={(e) => setIconSearchTerm(e.target.value)}
                      placeholder="Search icons..."
                      className="w-full pl-8 pr-3 py-1.5 text-sm bg-background-base border border-border-subtle rounded focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
                    />
                  </div>
                </div>

                {/* Icon List */}
                <div className="p-1">
                  {filteredIcons.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-text-muted text-center">
                      No icons found
                    </div>
                  ) : (
                    iconCategories.map((category) => {
                      const categoryIcons = filteredIcons.filter(
                        (i) => i.category === category
                      );
                      if (categoryIcons.length === 0) return null;

                      return (
                        <div key={category} className="mb-2">
                          <div className="px-2 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider sticky top-0 bg-background-elevated">
                            {category}
                          </div>
                          {categoryIcons.map((iconOption) => {
                            const IconComponent = getPinIcon(iconOption.name);
                            const isSelected = formState.icon === iconOption.name;

                            return (
                              <button
                                key={iconOption.name}
                                type="button"
                                onClick={() => {
                                  onUpdate("icon", iconOption.name);
                                  setShowIconDropdown(false);
                                  setIconSearchTerm("");
                                }}
                                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                                  isSelected
                                    ? "bg-accent-gold/20 text-accent-gold"
                                    : "text-text-primary hover:bg-background-base"
                                }`}
                              >
                                <IconComponent className="w-4 h-4 flex-shrink-0" />
                                <span className="flex-1 text-left">
                                  {iconOption.label}
                                </span>
                                {isSelected && (
                                  <PinIcons.Check className="w-4 h-4 text-accent-gold" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Custom Upload Option (Placeholder) */}
                <div className="border-t border-border-subtle p-1">
                  <button
                    type="button"
                    disabled
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-text-muted hover:bg-background-base disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Custom icon upload coming soon"
                  >
                    <PinIcons.Upload className="w-4 h-4" />
                    <span className="flex-1 text-left">Upload Custom...</span>
                    <span className="text-xs text-text-muted">(Soon)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Size Slider */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-muted">Size</label>
            <span className="text-xs font-display font-medium text-accent-gold">
              {formState.size}px
            </span>
          </div>
          <input
            type="range"
            min="16"
            max="128"
            step="1"
            value={formState.size}
            onChange={(e) => {
              const size = parseInt(e.target.value);
              if (size >= 16 && size <= 128) {
                onUpdate("size", size);
              }
            }}
            disabled={isUpdating}
            className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
          />
        </div>

        {/* Color Picker */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <div className="flex items-center justify-between">
            <label className="text-xs text-text-muted">Color</label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-secondary">
                {formState.color}
              </span>
              <input
                type="color"
                value={formState.color}
                onChange={(e) => {
                  const color = e.target.value;
                  // Validate hex color format
                  if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
                    onUpdate("color", color);
                  }
                }}
                disabled={isUpdating}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Opacity Slider */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-muted">Opacity</label>
            <span className="text-xs font-display font-medium text-accent-gold">
              {Math.round(formState.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={formState.opacity}
            onChange={(e) => {
              const opacity = parseFloat(e.target.value);
              if (opacity >= 0 && opacity <= 1) {
                onUpdate("opacity", opacity);
              }
            }}
            disabled={isUpdating}
            className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
          />
        </div>

        {/* Zoom Range Section */}
        <div className="space-y-3">
          {/* Section Header */}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Zoom Visibility
            </span>
            <button
              type="button"
              onClick={() => {
                onUpdate("minZoom", 0);
                onUpdate("maxZoom", 200);
              }}
              disabled={isUpdating}
              className="text-xs text-accent-gold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to default
            </button>
          </div>

          {/* Min Zoom Slider */}
          <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-text-muted">Min Zoom</label>
              <span className="text-xs font-display font-medium text-accent-gold">
                {formState.minZoom}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={formState.minZoom}
              onChange={(e) => {
                const minZoom = parseInt(e.target.value);
                // Validate: minZoom must be less than maxZoom
                if (minZoom < formState.maxZoom) {
                  onUpdate("minZoom", minZoom);
                }
              }}
              disabled={isUpdating}
              className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
            />
          </div>

          {/* Max Zoom Slider */}
          <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-text-muted">Max Zoom</label>
              <span className="text-xs font-display font-medium text-accent-gold">
                {formState.maxZoom}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={formState.maxZoom}
              onChange={(e) => {
                const maxZoom = parseInt(e.target.value);
                // Validate: maxZoom must be greater than minZoom
                if (maxZoom > formState.minZoom) {
                  onUpdate("maxZoom", maxZoom);
                }
              }}
              disabled={isUpdating}
              className="w-full h-1.5 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold disabled:opacity-50"
            />
          </div>

          {/* Zoom Range Preview */}
          <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
            <label className="block text-xs text-text-muted mb-1.5">
              Visibility Range
            </label>
            <div className="text-xs text-text-secondary">
              This pin will be visible at{" "}
              <span className="font-semibold text-accent-gold">
                {formState.minZoom}% - {formState.maxZoom}%
              </span>{" "}
              zoom
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${
            isUpdating ? "opacity-50" : ""
          } border border-border-subtle`}
        >
          <span className="text-sm text-text-secondary">Visible</span>
          <Switch
            checked={formState.isVisible}
            onCheckedChange={(checked) => onUpdate("isVisible", checked)}
          />
        </div>

        {/* Coordinates Display (Readonly) */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <label className="block text-xs text-text-muted mb-1.5">
            Coordinates
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-background-base rounded px-2 py-1.5">
              <span className="text-xs text-text-muted block">Lat</span>
              <span className="text-xs font-mono text-accent-gold">
                {pin.latitude.toFixed(4)}
              </span>
            </div>
            <div className="bg-background-base rounded px-2 py-1.5">
              <span className="text-xs text-text-muted block">Lng</span>
              <span className="text-xs font-mono text-accent-gold">
                {pin.longitude.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
