"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PinTypeEnum } from "@/types/pin.type";
import { getPinTypeOptions } from "@/constants/pin-types";
import { usePins } from "../logic/use-pins";
import { UpdatePinSchema } from "../logic/pin-schemas";
import type { Pin } from "@/types/pin.type";
import {
  MapPin,
  Save,
  Trash2,
  X,
  Palette,
  Settings,
  Eye,
  EyeOff,
  Layers,
} from "lucide-react";

interface PinEditFormProps {
  pin: Pin;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function PinEditForm({ pin, onSuccess, onClose }: PinEditFormProps) {
  const { updatePin, deletePin, isUpdating, isDeleting } = usePins(pin.gameWorldId);

  const [formData, setFormData] = useState({
    title: pin.title,
    description: pin.description || "",
    pinType: pin.pinType as string,
    latitude: pin.latitude,
    longitude: pin.longitude,
    icon: pin.icon || "",
    color: pin.color,
    size: pin.size,
    isVisible: pin.isVisible,
    properties: pin.properties || {},
    layerId: pin.layerId || "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const pinTypeOptions = getPinTypeOptions();

  const handleChange = (
    field: keyof typeof formData,
    value: string | number | boolean | object
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate with Zod
      UpdatePinSchema.parse({
        id: pin.id,
        title: formData.title,
        description: formData.description || undefined,
        pinType: formData.pinType,
        latitude: formData.latitude,
        longitude: formData.longitude,
        icon: formData.icon || undefined,
        color: formData.color,
        size: formData.size,
        isVisible: formData.isVisible,
        properties: formData.properties,
        layerId: formData.layerId || undefined,
      });

      // Call updatePin from usePins hook with proper type
      updatePin({
        id: pin.id,
        title: formData.title,
        description: formData.description || undefined,
        pinType: formData.pinType as any,
        latitude: formData.latitude,
        longitude: formData.longitude,
        icon: formData.icon || undefined,
        color: formData.color,
        size: formData.size,
        isVisible: formData.isVisible,
        properties: formData.properties,
        layerId: formData.layerId || undefined,
      });

      // Show success message (console for now, can be replaced with toast)
      console.log("Pin updated successfully");

      // Call onSuccess callback
      onSuccess?.();
    } catch (error) {
      console.error("Validation error:", error);
      if (error instanceof Error) {
        setErrors({ form: error.message });
      }
    }
  };

  const handleDelete = async () => {
    try {
      // Call deletePin from usePins hook
      deletePin(pin.id);

      // Show success message
      console.log("Pin deleted successfully");

      // Call onSuccess callback to close form or refresh
      onSuccess?.();
    } catch (error) {
      console.error("Delete error:", error);
      setErrors({ form: "Failed to delete pin" });
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <h3 className="text-lg font-display font-semibold text-text-primary">
          Edit Pin
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Basic Info */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter pin title..."
          className="w-full h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
        />
        {errors.title && (
          <span className="text-xs text-red-500">{errors.title}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add a description..."
          rows={3}
          className="w-full px-4 py-3 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all resize-none"
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description}</span>
        )}
      </div>

      {/* Pin Type */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-primary flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Pin Type
        </label>
        <select
          value={formData.pinType}
          onChange={(e) => handleChange("pinType", e.target.value)}
          className="w-full h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
        >
          {pinTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Latitude</label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => handleChange("latitude", parseFloat(e.target.value))}
            className="w-full h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
          />
          {errors.latitude && (
            <span className="text-xs text-red-500">{errors.latitude}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary">Longitude</label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) =>
              handleChange("longitude", parseFloat(e.target.value))
            }
            className="w-full h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
          />
          {errors.longitude && (
            <span className="text-xs text-red-500">{errors.longitude}</span>
          )}
        </div>
      </div>

      {/* Appearance */}
      <div className="border-t border-border-subtle pt-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Appearance
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {/* Icon */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Icon</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleChange("icon", e.target.value)}
              placeholder="e.g. map-pin"
              className="w-full h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            />
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-12 h-11 rounded-sm border border-border-subtle cursor-pointer"
              />
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="text-sm font-medium text-text-primary">
            Size: {formData.size}px
          </label>
          <input
            type="range"
            min="16"
            max="128"
            value={formData.size}
            onChange={(e) => handleChange("size", parseInt(e.target.value))}
            className="w-full h-2 bg-background-elevated rounded-lg appearance-none cursor-pointer accent-accent-gold"
          />
        </div>
      </div>

      {/* Visibility */}
      <div className="flex items-center justify-between py-3 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          {formData.isVisible ? (
            <Eye className="w-4 h-4 text-text-secondary" />
          ) : (
            <EyeOff className="w-4 h-4 text-text-muted" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">
              Visible on Map
            </span>
            <span className="text-xs text-text-muted">
              {formData.isVisible
                ? "Pin is visible to all viewers"
                : "Pin is hidden from view"}
            </span>
          </div>
        </div>
        <Switch
          checked={formData.isVisible}
          onCheckedChange={(checked) => handleChange("isVisible", checked)}
        />
      </div>

      {/* Advanced */}
      <div className="border-t border-border-subtle pt-4">
        <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Advanced
        </h4>

        {/* Layer ID */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-text-primary flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Layer ID
          </label>
          <input
            type="text"
            value={formData.layerId}
            onChange={(e) => handleChange("layerId", e.target.value)}
            placeholder="Optional layer assignment"
            className="w-full h-11 px-4 rounded-sm border border-border-subtle bg-background-card/60 backdrop-blur-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
          />
        </div>
      </div>

      {/* Error Message */}
      {errors.form && (
        <div className="p-3 rounded-sm bg-red-500/10 border border-red-500/50">
          <p className="text-sm text-red-500">{errors.form}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
        {/* Delete Button */}
        {!showDeleteConfirm ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </div>
        )}

        {/* Cancel & Update */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isUpdating || isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isUpdating || isDeleting}
          >
            <Save className="w-4 h-4" />
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
