import { getPinTypeOptions } from "@/constants/pin-types";
import { Switch } from "@/components/ui/switch";
import * as PinIcons from "lucide-react";
import type { Pin } from "@prisma/client";

interface PinPropertiesSectionProps {
  pin: Pin;
  formState: {
    title: string;
    description: string;
    pinType: Pin["pinType"];
    size: number;
    color: string;
    isVisible: boolean;
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

  const getPinIcon = (iconName: string) => {
    const IconComponent = (PinIcons as any)[iconName];
    return IconComponent ? IconComponent : PinIcons.MapPin;
  };

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
            onChange={(e) => onUpdate("title", e.target.value)}
            disabled={isUpdating}
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none disabled:opacity-50"
            placeholder="Enter pin title..."
          />
        </div>

        {/* Description Textarea */}
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <label className="block text-xs text-text-muted mb-1.5">
            Description
          </label>
          <textarea
            value={formState.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            disabled={isUpdating}
            rows={3}
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none resize-none disabled:opacity-50"
            placeholder="Enter pin description..."
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
            min="10"
            max="100"
            value={formState.size}
            onChange={(e) => onUpdate("size", parseInt(e.target.value))}
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
                onChange={(e) => onUpdate("color", e.target.value)}
                disabled={isUpdating}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent disabled:opacity-50"
              />
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
