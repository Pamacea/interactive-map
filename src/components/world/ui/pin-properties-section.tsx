import { getPinTypeOptions } from "@/constants/pin-types";
import { PIN_ICONS, getIconByName, getUniqueCategories } from "@/constants/pin-icons";
import { Switch } from "@/components/ui/switch";
import { IconUploadDialog } from "./icon-upload-dialog";
import * as PinIcons from "lucide-react";
import type { Pin } from "@prisma/client";
import { useState, useEffect } from "react";

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
  error?: string | null;
  onUpdate: <K extends keyof Pin>(field: K, value: Pin[K]) => void;
  onIconUpload?: (file: File) => Promise<void>;
  onRetry?: () => void;
}

export function PinPropertiesSection({
  pin,
  formState,
  isUpdating,
  error,
  onUpdate,
  onIconUpload,
  onRetry,
}: PinPropertiesSectionProps) {
  const pinTypeOptions = getPinTypeOptions();
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [showIconDropdown, setShowIconDropdown] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Local state for title editing (to avoid triggering updates on every keystroke)
  const [localTitle, setLocalTitle] = useState(formState.title);

  // Local state for description editing (to avoid triggering updates on every keystroke)
  const [localDescription, setLocalDescription] = useState(formState.description);

  // Sync local states when formState changes externally
  useEffect(() => {
    setLocalTitle(formState.title);
    setLocalDescription(formState.description);
  }, [formState.title, formState.description]);

  const iconCategories = getUniqueCategories();

  const getPinIcon = (iconName: string) => {
    const IconComponent = (PinIcons as any)[iconName];
    return IconComponent ? IconComponent : PinIcons.MapPin;
  };

  // Check if icon is a custom uploaded image
  const isCustomImage = formState.icon?.startsWith("/");

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
      {/* Error Display */}
      {error && (
        <div className="px-3 py-2 rounded-sm bg-rose-950/30 border border-rose-700/50">
          <div className="flex items-start gap-2">
            <PinIcons.AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-rose-300">{error}</p>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs text-rose-300 hover:text-rose-200 underline flex-shrink-0"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isUpdating && !error && (
        <div className="px-3 py-2 rounded-sm bg-blue-950/30 border border-blue-700/50">
          <div className="flex items-center gap-2">
            <PinIcons.Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <p className="text-xs text-blue-300">Updating pin...</p>
          </div>
        </div>
      )}

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
            value={localTitle}
            onChange={(e) => {
              const title = e.target.value;
              // Only update local state, don't trigger server update
              if (title.length <= 200) {
                setLocalTitle(title);
              }
            }}
            onBlur={() => {
              // Only trigger update on blur
              const trimmedTitle = localTitle.trim();
              if (trimmedTitle.length > 0 && trimmedTitle !== formState.title) {
                onUpdate("title", trimmedTitle);
              } else if (trimmedTitle.length === 0) {
                // Revert to original if empty
                setLocalTitle(formState.title);
              }
            }}
            onKeyDown={(e) => {
              // Allow Enter to trigger update
              if (e.key === "Enter") {
                e.currentTarget.blur();
              } else if (e.key === "Escape") {
                // Revert on Escape
                setLocalTitle(formState.title);
                e.currentTarget.blur();
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
            value={localDescription}
            onChange={(e) => {
              const description = e.target.value;
              // Only update local state, don't trigger server update
              if (description.length <= 5000) {
                setLocalDescription(description);
              }
            }}
            onBlur={() => {
              // Only trigger update on blur
              const trimmedDescription = localDescription.trim();
              if (trimmedDescription !== formState.description) {
                onUpdate("description", trimmedDescription);
              } else {
                // Revert to original if unchanged
                setLocalDescription(formState.description);
              }
            }}
            onKeyDown={(e) => {
              // Allow Escape to revert
              if (e.key === "Escape") {
                setLocalDescription(formState.description);
                e.currentTarget.blur();
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
              {isCustomImage ? (
                <img
                  src={formState.icon!}
                  alt="Custom icon"
                  className="w-4 h-4 object-contain"
                />
              ) : (
                <CurrentIconComponent className="w-4 h-4 text-accent-gold" />
              )}
              <span className="text-sm text-text-primary flex-1 text-left">
                {isCustomImage
                  ? "Custom Icon"
                  : PIN_ICONS.find((i) => i.name === formState.icon)?.label ||
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
                      className="w-full pl-8 pr-8 py-1.5 text-sm bg-background-base border border-border-subtle rounded focus:outline-none focus:ring-1 focus:ring-accent-gold/50"
                    />
                    {iconSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setIconSearchTerm("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                        title="Clear search"
                      >
                        <PinIcons.X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Icon List */}
                <div className="p-1">
                  {filteredIcons.length === 0 ? (
                    <div className="px-2 py-8 text-center">
                      <PinIcons.Search className="w-8 h-8 text-text-muted mx-auto mb-2 opacity-50" />
                      <p className="text-sm text-text-muted mb-3">
                        No icons found matching "{iconSearchTerm}"
                      </p>
                      <button
                        type="button"
                        onClick={() => setIconSearchTerm("")}
                        className="text-sm text-accent-gold hover:underline transition-colors"
                      >
                        Clear search to see all icons
                      </button>
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

                {/* Custom Upload Option */}
                <div className="border-t border-border-subtle p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadDialog(true);
                      setShowIconDropdown(false);
                    }}
                    disabled={isUpdating || !onIconUpload}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-text-secondary hover:bg-background-base hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <PinIcons.Upload className="w-4 h-4" />
                    <span className="flex-1 text-left">Upload Custom...</span>
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

      {/* Icon Upload Dialog */}
      {onIconUpload && (
        <IconUploadDialog
          isOpen={showUploadDialog}
          onClose={() => setShowUploadDialog(false)}
          onUpload={onIconUpload}
          pinId={pin.id}
        />
      )}
    </section>
  );
}
