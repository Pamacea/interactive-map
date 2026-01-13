"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  useGrid,
  useSnap,
  useMapStore,
} from "@/stores/map-store";
import { useSelectedPin } from "@/stores/use-pins-store";
import { updatePin } from "@/actions/pins";
import { PinTypeEnum } from "@/types/pin.type";
import { getPinTypeOptions } from "@/constants/pin-types";
import * as PinIcons from "lucide-react";

export function PropertiesPanel() {
  // Global map properties
  const grid = useGrid();
  const snap = useSnap();
  const setGrid = useMapStore((state) => state.setGrid);
  const setSnap = useMapStore((state) => state.setSnap);

  // Pin properties
  const selectedPin = useSelectedPin();
  const [pinTitle, setPinTitle] = useState("");
  const [pinDescription, setPinDescription] = useState("");
  const [pinType, setPinType] = useState<PinTypeEnum>(PinTypeEnum.CUSTOM);
  const [pinSize, setPinSize] = useState(32);
  const [pinColor, setPinColor] = useState("#3b82f6");
  const [pinVisibility, setPinVisibility] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update form when pin selection changes
  useEffect(() => {
    if (selectedPin) {
      setPinTitle(selectedPin.title);
      setPinDescription(selectedPin.description || "");
      setPinType(selectedPin.pinType as PinTypeEnum);
      setPinSize(selectedPin.size);
      setPinColor(selectedPin.color);
      setPinVisibility(selectedPin.isVisible);
    }
  }, [selectedPin]);

  // Handle pin updates
  const handleUpdatePin = async (field: string, value: any) => {
    if (!selectedPin || isUpdating) return;

    setIsUpdating(true);
    try {
      await updatePin({
        id: selectedPin.id,
        [field]: value,
      });
    } catch (error) {
      console.error("Failed to update pin:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get icon component for pin type
  const getPinIcon = (iconName: string) => {
    const IconComponent = (PinIcons as any)[iconName];
    return IconComponent ? IconComponent : PinIcons.MapPin;
  };

  const pinTypeOptions = getPinTypeOptions();
  const CurrentPinTypeIcon = selectedPin ? getPinIcon(
    pinTypeOptions.find(opt => opt.value === selectedPin.pinType)?.icon || "MapPin"
  ) : null;

  return (
    <div className="space-y-4">
      {/* Pin Properties Section */}
      {selectedPin ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-accent-gold/30">
            {CurrentPinTypeIcon && <CurrentPinTypeIcon className="w-4 h-4 text-accent-gold" />}
            <span className="text-xs font-display font-medium text-accent-gold uppercase tracking-wider">
              Pin Properties
            </span>
          </div>

          <div className="space-y-3">
            {/* Title Input */}
            <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
              <label className="block text-xs text-text-muted mb-1.5">Title</label>
              <input
                type="text"
                value={pinTitle}
                onChange={(e) => {
                  setPinTitle(e.target.value);
                  handleUpdatePin("title", e.target.value);
                }}
                disabled={isUpdating}
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none disabled:opacity-50"
                placeholder="Enter pin title..."
              />
            </div>

            {/* Description Textarea */}
            <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
              <label className="block text-xs text-text-muted mb-1.5">Description</label>
              <textarea
                value={pinDescription}
                onChange={(e) => {
                  setPinDescription(e.target.value);
                  handleUpdatePin("description", e.target.value);
                }}
                disabled={isUpdating}
                rows={3}
                className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none resize-none disabled:opacity-50"
                placeholder="Enter pin description..."
              />
            </div>

            {/* Pin Type Dropdown */}
            <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
              <label className="block text-xs text-text-muted mb-1.5">Pin Type</label>
              <select
                value={pinType}
                onChange={(e) => {
                  const newType = e.target.value as PinTypeEnum;
                  setPinType(newType);
                  handleUpdatePin("pinType", newType);
                }}
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
                <span className="text-xs font-display font-medium text-accent-gold">{pinSize}px</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={pinSize}
                onChange={(e) => {
                  const newSize = parseInt(e.target.value);
                  setPinSize(newSize);
                  handleUpdatePin("size", newSize);
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
                  <span className="text-xs font-mono text-text-secondary">{pinColor}</span>
                  <input
                    type="color"
                    value={pinColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setPinColor(newColor);
                      handleUpdatePin("color", newColor);
                    }}
                    disabled={isUpdating}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Visibility Toggle */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${isUpdating ? "opacity-50" : ""} border border-border-subtle`}>
              <span className="text-sm text-text-secondary">Visible</span>
              <Switch
                checked={pinVisibility}
                onCheckedChange={(checked) => {
                  setPinVisibility(checked);
                  handleUpdatePin("isVisible", checked);
                }}
              />
            </div>

            {/* Coordinates Display (Readonly) */}
            <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
              <label className="block text-xs text-text-muted mb-1.5">Coordinates</label>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-background-base rounded px-2 py-1.5">
                  <span className="text-xs text-text-muted block">Lat</span>
                  <span className="text-xs font-mono text-accent-gold">
                    {selectedPin.latitude.toFixed(4)}
                  </span>
                </div>
                <div className="bg-background-base rounded px-2 py-1.5">
                  <span className="text-xs text-text-muted block">Lng</span>
                  <span className="text-xs font-mono text-accent-gold">
                    {selectedPin.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
            <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-display font-medium text-text-secondary uppercase tracking-wider">
              Pin Properties
            </span>
          </div>
          <div className="px-3 py-4 rounded-sm bg-background-elevated border border-border-subtle text-center">
            <p className="text-sm text-text-muted">No pin selected</p>
            <p className="text-xs text-text-muted/70 mt-1">Click a pin on the map to edit its properties</p>
          </div>
        </section>
      )}

      {/* Map Properties Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-display font-medium text-text-secondary uppercase tracking-wider">
            Map Properties
          </span>
        </div>

        <div className="space-y-3">
          <div className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${grid ? "border border-accent-gold/30" : "border border-border-subtle"}`}>
            <span className="text-sm text-text-secondary">Grid</span>
            <Switch checked={grid} onCheckedChange={setGrid} />
          </div>

          <div className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${snap ? "border border-accent-gold/30" : "border border-border-subtle"}`}>
            <span className="text-sm text-text-secondary">Snap</span>
            <Switch checked={snap} onCheckedChange={setSnap} />
          </div>
        </div>
      </section>
    </div>
  );
}
