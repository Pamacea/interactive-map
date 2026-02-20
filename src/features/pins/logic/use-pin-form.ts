import { useState, useCallback, useEffect } from "react";
import { z } from "zod";
import { PinType, PIN_TYPE_COLORS, PIN_TYPE_SIZES, type PinCreateInput, type PinUpdateInput } from "@/types/pin.type";
import { CreatePinSchema, UpdatePinSchema } from "./pin-schemas";

export interface PinFormData {
  title: string;
  description: string;
  pinType: (typeof PinType)[keyof typeof PinType];
  latitude: number;
  longitude: number;
  color: string;
  size: number;
  isVisible: boolean;
  properties: string;
  icon: string;
  layerId: string;
}

export interface UsePinFormOptions {
  initialData?: Partial<PinFormData>;
  mode: "create" | "edit";
  worldId?: string;
  pinId?: string;
}

export function usePinForm({ initialData, mode, worldId, pinId }: UsePinFormOptions) {
  // Use a key to reset form when mode or initialData changes significantly
  const [formData, setFormData] = useState<PinFormData>(() => ({
    title: initialData?.title || "",
    description: initialData?.description || "",
    pinType: initialData?.pinType || PinType.CUSTOM,
    latitude: initialData?.latitude || 0,
    longitude: initialData?.longitude || 0,
    color: initialData?.color || PIN_TYPE_COLORS[PinType.CUSTOM],
    size: initialData?.size || PIN_TYPE_SIZES[PinType.CUSTOM],
    isVisible: initialData?.isVisible ?? true,
    properties: initialData?.properties || "",
    icon: initialData?.icon || "",
    layerId: initialData?.layerId || "",
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof PinFormData, value: string | number | boolean) => {
    setFormData((prev) => {
      // When pinType changes and we don't have a custom color, auto-update color/size
      if (field === "pinType" && !initialData?.color) {
        return {
          ...prev,
          [field]: value,
          color: PIN_TYPE_COLORS[value as typeof PinType],
          size: PIN_TYPE_SIZES[value as typeof PinType],
        };
      }
      return { ...prev, [field]: value };
    });

    // Clear error for this field when user types
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, [initialData?.color]);

  const validate = useCallback((): boolean => {
    const schema = mode === "create" ? CreatePinSchema : UpdatePinSchema;

    try {
      if (mode === "create") {
        const dataToValidate = {
          ...formData,
          gameWorldId: worldId || "",
        };
        CreatePinSchema.parse(dataToValidate);
      } else {
        const dataToValidate = {
          id: pinId || "",
          ...formData,
        };
        UpdatePinSchema.parse(dataToValidate);
      }

      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            newErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData, mode, worldId, pinId]);

  const getSubmitData = useCallback((): PinCreateInput | PinUpdateInput => {
    let properties = undefined;

    if (formData.properties) {
      try {
        properties = JSON.parse(formData.properties);
      } catch {
        throw new Error("Invalid JSON in properties field");
      }
    }

    const baseData = {
      title: formData.title,
      description: formData.description || undefined,
      pinType: formData.pinType,
      latitude: formData.latitude,
      longitude: formData.longitude,
      color: formData.color,
      size: formData.size,
      isVisible: formData.isVisible,
      properties,
      icon: formData.icon || undefined,
      layerId: formData.layerId || undefined,
    };

    if (mode === "create") {
      return {
        ...baseData,
        gameWorldId: worldId || "",
      } as PinCreateInput;
    } else {
      return {
        id: pinId || "",
        ...baseData,
      } as PinUpdateInput;
    }
  }, [formData, mode, worldId, pinId]);

  const reset = useCallback(() => {
    setFormData({
      title: initialData?.title || "",
      description: initialData?.description || "",
      pinType: initialData?.pinType || PinType.CUSTOM,
      latitude: initialData?.latitude || 0,
      longitude: initialData?.longitude || 0,
      color: initialData?.color || PIN_TYPE_COLORS[PinType.CUSTOM],
      size: initialData?.size || PIN_TYPE_SIZES[PinType.CUSTOM],
      isVisible: initialData?.isVisible ?? true,
      properties: initialData?.properties || "",
      icon: initialData?.icon || "",
      layerId: initialData?.layerId || "",
    });
    setErrors({});
  }, [initialData]);

  return {
    formData,
    errors,
    updateField,
    validate,
    getSubmitData,
    reset,
  };
}
