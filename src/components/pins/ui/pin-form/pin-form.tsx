"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import type { PinFormData } from "../../logic/use-pin-form";
import { FormTextField, FormTextAreaField, FormNumberField } from "./form-fields";
import { FormActions } from "./form-actions";
import {
  FormPinTypeSelector,
  FormColorPicker,
  FormSizeSlider,
  FormVisibilityToggle,
  FormLayerSelect,
  FormJsonField,
  FormIconSelect,
} from "./pin-form-fields";

export interface PinFormProps {
  formData: PinFormData;
  errors: Record<string, string>;
  onUpdateField: (field: string | number | symbol, value: string | number | boolean) => void;
  layers: Array<{ id: string; name: string }>;
  mode: "create" | "edit";
  showLayer?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  titleRef?: React.RefObject<HTMLInputElement | null>;
}

export const PinForm: FC<PinFormProps> = ({
  formData,
  errors,
  onUpdateField,
  layers,
  mode,
  showLayer = true,
  isSubmitting = false,
  onSubmit,
  onCancel,
  onDelete,
  titleRef,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <FormTextField
        label="Title"
        value={formData.title}
        onChange={(value) => onUpdateField("title", value)}
        error={errors.title}
        placeholder="Enter pin title"
        required
        inputRef={titleRef}
      />

      {/* Description */}
      <FormTextAreaField
        label="Description"
        value={formData.description}
        onChange={(value) => onUpdateField("description", value)}
        error={errors.description}
        placeholder="Enter a description (optional)"
        rows={3}
      />

      {/* Pin Type */}
      <FormPinTypeSelector
        value={formData.pinType}
        onChange={(value) => onUpdateField("pinType", value)}
        error={errors.pinType}
        mode={mode === "create" ? "grid" : "select"}
      />

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-4">
        <FormNumberField
          label="Latitude"
          value={formData.latitude}
          onChange={(value) => onUpdateField("latitude", value)}
          error={errors.latitude}
          min={0}
          max={1}
          step={0.0001}
        />
        <FormNumberField
          label="Longitude"
          value={formData.longitude}
          onChange={(value) => onUpdateField("longitude", value)}
          error={errors.longitude}
          min={0}
          max={1}
          step={0.0001}
        />
      </div>

      {/* Color, Size, Icon */}
      <div className="grid grid-cols-3 gap-4">
        <FormColorPicker
          label="Color"
          value={formData.color}
          onChange={(value) => onUpdateField("color", value)}
          error={errors.color}
        />
        <FormSizeSlider
          label="Size"
          value={formData.size}
          onChange={(value) => onUpdateField("size", value)}
          error={errors.size}
          min={16}
          max={mode === "create" ? 64 : 128}
        />
        <FormIconSelect
          label="Icon"
          value={formData.icon}
          onChange={(value) => onUpdateField("icon", value)}
          error={errors.icon}
        />
      </div>

      {/* Visibility */}
      <FormVisibilityToggle
        label="Visible on map"
        checked={formData.isVisible}
        onChange={(checked) => onUpdateField("isVisible", checked)}
      />

      {/* Layer */}
      {showLayer && (
        <FormLayerSelect
          label="Layer"
          value={formData.layerId}
          onChange={(value) => onUpdateField("layerId", value)}
          layers={layers}
          error={errors.layerId}
        />
      )}

      {/* Properties (JSON) */}
      <FormJsonField
        label="Custom Properties"
        value={formData.properties}
        onChange={(value) => onUpdateField("properties", value)}
        error={errors.properties}
        placeholder='{"level": 10, "faction": "Alliance"}'
      />

      {/* Actions */}
      <FormActions
        mode={mode}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        onDelete={onDelete}
      />
    </form>
  );
};
