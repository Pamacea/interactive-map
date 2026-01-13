"use client";

import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import {
  Building2,
  Home,
  MapPin,
  User,
  Mountain,
  ShoppingBag,
  Scroll,
  Gem,
  Circle,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CreatePinSchema } from "../logic/pin-schemas";
import { PinTypeEnum, PIN_TYPE_COLORS, PIN_TYPE_SIZES, type PinCreateInput } from "@/types/pin.type";
import { usePins } from "../logic/use-pins";

// Simplified layer interface for form display
interface FormLayer {
  id: string;
  name: string;
}

interface PinCreateFormProps {
  worldId: string;
  layers?: FormLayer[];
  initialLat?: number;
  initialLng?: number;
  initialLayerId?: string;
  initialPinType?: PinTypeEnum;
  onSuccess?: () => void;
  onClose?: () => void;
}

const PIN_TYPE_OPTIONS = [
  { value: PinTypeEnum.CITY, label: "City", icon: Building2 },
  { value: PinTypeEnum.VILLAGE, label: "Village", icon: Home },
  { value: PinTypeEnum.POI, label: "Point of Interest", icon: MapPin },
  { value: PinTypeEnum.CHARACTER, label: "Character", icon: User },
  { value: PinTypeEnum.DUNGEON, label: "Dungeon", icon: Mountain },
  { value: PinTypeEnum.SHOP, label: "Shop", icon: ShoppingBag },
  { value: PinTypeEnum.QUEST, label: "Quest", icon: Scroll },
  { value: PinTypeEnum.TREASURE, label: "Treasure", icon: Gem },
  { value: PinTypeEnum.CUSTOM, label: "Custom", icon: Circle },
];

const PREDEFINED_COLORS = [
  "#d4af37",
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#eab308",
  "#64748b",
  "#ec4899",
  "#14b8a6",
];

export function PinCreateForm({
  worldId,
  layers = [],
  initialLat,
  initialLng,
  initialLayerId,
  initialPinType,
  onSuccess,
  onClose,
}: PinCreateFormProps) {
  console.log("📌 [PinCreateForm] Props received:", {
    worldId,
    initialLat,
    initialLng,
    initialLayerId,
    initialPinType,
    hasOnSuccess: !!onSuccess,
    hasOnClose: !!onClose,
  });

  const { createPin, isCreating, createError } = usePins(worldId);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ref for auto-focusing title field
  const titleRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pinType: initialPinType || PinTypeEnum.CUSTOM,
    latitude: initialLat || 0,
    longitude: initialLng || 0,
    color: initialPinType ? PIN_TYPE_COLORS[initialPinType] : PIN_TYPE_COLORS[PinTypeEnum.CUSTOM],
    size: initialPinType ? PIN_TYPE_SIZES[initialPinType] : PIN_TYPE_SIZES[PinTypeEnum.CUSTOM],
    isVisible: true,
    properties: "",
    icon: "",
    layerId: initialLayerId || "",
  });

  const watchedPinType = formData.pinType;
  const watchedColor = formData.color;
  const watchedSize = formData.size;

  // Auto-focus title field when form opens
  useEffect(() => {
    if (titleRef.current) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, []);

  // Sync initialPinType changes to form
  useEffect(() => {
    if (initialPinType) {
      setFormData((prev) => ({
        ...prev,
        pinType: initialPinType,
        color: PIN_TYPE_COLORS[initialPinType],
        size: PIN_TYPE_SIZES[initialPinType],
      }));
    }
  }, [initialPinType]);

  useEffect(() => {
    if (watchedPinType) {
      setFormData((prev) => ({
        ...prev,
        color: PIN_TYPE_COLORS[watchedPinType],
        size: PIN_TYPE_SIZES[watchedPinType],
      }));
    }
  }, [watchedPinType]);

  const updateField = (field: keyof typeof formData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      CreatePinSchema.parse({
        ...formData,
        gameWorldId: worldId,
        layerId: formData.layerId || undefined,
        properties: formData.properties || undefined,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📌 [PinCreateForm] Form submit called with formData:", {
      ...formData,
      gameWorldId: worldId,
    });

    if (!validateForm()) {
      console.log("📌 [PinCreateForm] Form validation FAILED");
      return;
    }

    console.log("📌 [PinCreateForm] Form validation PASSED");

    try {
      let properties = undefined;

      if (formData.properties) {
        try {
          properties = JSON.parse(formData.properties);
        } catch {
          setToastMessage("Invalid JSON in properties field");
          setToastType("error");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          return;
        }
      }

      const pinData: PinCreateInput = {
        title: formData.title,
        description: formData.description || undefined,
        pinType: formData.pinType as PinTypeEnum,
        latitude: formData.latitude,
        longitude: formData.longitude,
        color: formData.color,
        size: formData.size,
        isVisible: formData.isVisible,
        properties,
        icon: formData.icon || undefined,
        gameWorldId: worldId,
        layerId: formData.layerId || undefined,
      };

      createPin(pinData, {
        onSuccess: () => {
          setToastMessage("Pin created successfully!");
          setToastType("success");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
          onSuccess?.();
        },
        onError: (error: Error) => {
          setToastMessage(error.message || "Failed to create pin");
          setToastType("error");
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        },
      });
    } catch (error) {
      setToastMessage("An unexpected error occurred");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <>
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-sm border shadow-lg ${
            toastType === "success"
              ? "bg-status-success/20 border-status-success text-status-success"
              : "bg-status-error/20 border-status-error text-status-error"
          }`}
        >
          <div className="flex items-center gap-2">
            {toastType === "success" ? (
              <svg
                className="w-5 h-5"
                fill="none"
              >
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <X className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-text-primary">Title *</label>
          <input
            ref={titleRef}
            type="text"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Enter pin title..."
            className="w-full h-10 px-3 rounded-sm border border-border-subtle bg-background-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
          />
          {errors.title && (
            <span className="text-xs text-status-error">{errors.title}</span>
          )}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-text-primary">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Enter description (optional)..."
            rows={3}
            className="w-full px-3 py-2 rounded-sm border border-border-subtle bg-background-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all resize-none"
          />
          {errors.description && (
            <span className="text-xs text-status-error">{errors.description}</span>
          )}
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-text-primary">Pin Type</label>
          <div className="grid grid-cols-3 gap-2">
            {PIN_TYPE_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = watchedPinType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField("pinType", option.value)}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-sm border transition-all ${
                    isSelected
                      ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                      : "border-border-subtle bg-background-elevated text-text-secondary hover:border-border-default"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
          {errors.pinType && (
            <span className="text-xs text-status-error">{errors.pinType}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => updateField("latitude", parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-sm border border-border-subtle bg-background-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            />
            {errors.latitude && (
              <span className="text-xs text-status-error">{errors.latitude}</span>
            )}
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => updateField("longitude", parseFloat(e.target.value) || 0)}
              className="w-full h-10 px-3 rounded-sm border border-border-subtle bg-background-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            />
            {errors.longitude && (
              <span className="text-xs text-status-error">{errors.longitude}</span>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-text-primary">Color</label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => updateField("color", color)}
                className={`w-8 h-8 rounded-sm border-2 transition-all hover:scale-110 ${
                  watchedColor === color
                    ? "border-accent-gold scale-110"
                    : "border-border-subtle"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => updateField("color", e.target.value)}
            className="w-full h-10 mt-2 rounded-sm border border-border-subtle bg-background-elevated cursor-pointer"
          />
          {errors.color && (
            <span className="text-xs text-status-error">{errors.color}</span>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Size: {watchedSize}px
            </label>
            <span className="text-xs text-text-muted">16px - 64px</span>
          </div>
          <input
            type="range"
            min="16"
            max="64"
            value={formData.size}
            onChange={(e) => updateField("size", parseInt(e.target.value))}
            className="w-full h-2 bg-background-elevated rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-accent-gold [&::-webkit-slider-thumb]:cursor-pointer"
          />
          {errors.size && (
            <span className="text-xs text-status-error">{errors.size}</span>
          )}
        </div>

        {layers.length > 0 && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-text-primary">Layer</label>
            <select
              value={formData.layerId}
              onChange={(e) => updateField("layerId", e.target.value)}
              className="w-full h-10 px-3 rounded-sm border border-border-subtle bg-background-elevated text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
            >
              <option value="">No layer</option>
              {layers.map((layer) => (
                <option key={layer.id} value={layer.id}>
                  {layer.name}
                </option>
              ))}
            </select>
            {errors.layerId && (
              <span className="text-xs text-status-error">{errors.layerId}</span>
            )}
          </div>
        )}

        <div className="grid gap-2">
          <label className="text-sm font-medium text-text-primary">Icon</label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => updateField("icon", e.target.value)}
            placeholder="e.g., map-pin, castle, home (optional)"
            className="w-full h-10 px-3 rounded-sm border border-border-subtle bg-background-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all"
          />
          {errors.icon && (
            <span className="text-xs text-status-error">{errors.icon}</span>
          )}
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
          <div className="flex items-center gap-2">
            {formData.isVisible ? (
              <Eye className="w-4 h-4 text-text-secondary" />
            ) : (
              <EyeOff className="w-4 h-4 text-text-muted" />
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">Visible</span>
              <span className="text-xs text-text-muted">Show on map</span>
            </div>
          </div>
          <Switch
            checked={formData.isVisible}
            onCheckedChange={(checked) => updateField("isVisible", checked)}
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-text-primary">
            Properties (JSON)
          </label>
          <textarea
            value={formData.properties}
            onChange={(e) => updateField("properties", e.target.value)}
            placeholder={`{ "level": 5, "faction": "Light" }`}
            rows={4}
            className="w-full px-3 py-2 rounded-sm border border-border-subtle bg-background-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold transition-all resize-none font-mono text-xs"
          />
          <span className="text-xs text-text-muted">
            Optional custom data (valid JSON format)
          </span>
          {errors.properties && (
            <span className="text-xs text-status-error">{errors.properties}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="md"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Pin"}
          </Button>
        </div>
      </form>
    </>
  );
}
