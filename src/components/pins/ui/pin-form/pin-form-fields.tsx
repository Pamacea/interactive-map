import { FC } from "react";
import { pinTypeConfig, type PinType } from "@/constants/pin-types";

// Re-export basic fields
export { FormTextField, FormTextAreaField, FormNumberField } from "./form-fields";

// Pin Type Selector
interface FormPinTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  mode: "grid" | "select";
}

export const FormPinTypeSelector: FC<FormPinTypeSelectorProps> = ({
  value,
  onChange,
  error,
  mode,
}) => {
  const types = Object.entries(pinTypeConfig) as [PinType, typeof pinTypeConfig[PinType]][];

  if (mode === "select") {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none">
          Pin Type
          <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold"
        >
          {types.map(([type, config]) => (
            <option key={type} value={type}>
              {config.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">
        Pin Type
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {types.map(([type, config]) => (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`
              px-3 py-2 rounded-sm border text-sm font-medium transition-all
              ${
                value === type
                  ? "border-accent-gold bg-accent-gold/20 text-accent-gold"
                  : "border-border-subtle bg-background-base text-text-secondary hover:border-border-default"
              }
            `}
          >
            {config.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Color Picker
interface FormColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FormColorPicker: FC<FormColorPickerProps> = ({
  label,
  value,
  onChange,
  error,
}) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium leading-none">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-sm border border-border-subtle cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm uppercase"
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Size Slider
interface FormSizeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min: number;
  max: number;
}

export const FormSizeSlider: FC<FormSizeSliderProps> = ({
  label,
  value,
  onChange,
  error,
  min,
  max,
}) => (
  <div className="grid gap-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium leading-none">{label}</label>
      <span className="text-xs text-text-muted">{value}px</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-background-base rounded-lg appearance-none cursor-pointer accent-accent-gold"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Visibility Toggle
interface FormVisibilityToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const FormVisibilityToggle: FC<FormVisibilityToggleProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id="visible"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-border-subtle text-accent-gold focus:ring-accent-gold"
    />
    <label htmlFor="visible" className="text-sm font-medium leading-none cursor-pointer">
      {label}
    </label>
  </div>
);

// Layer Select
interface FormLayerSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  layers: Array<{ id: string; name: string }>;
  error?: string;
}

export const FormLayerSelect: FC<FormLayerSelectProps> = ({
  label,
  value,
  onChange,
  layers,
  error,
}) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium leading-none">
      {label}
      <span className="text-red-500 ml-1">*</span>
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold"
    >
      <option value="">Select a layer</option>
      {layers.map((layer) => (
        <option key={layer.id} value={layer.id}>
          {layer.name}
        </option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// JSON Field
interface FormJsonFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export const FormJsonField: FC<FormJsonFieldProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium leading-none">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold resize-none"
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Icon Select
interface FormIconSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const FormIconSelect: FC<FormIconSelectProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  // Simplified icon selector - could be expanded with actual icon picker
  const commonIcons = ["MapPin", "Flag", "Star", "Heart", "Circle", "Square"];

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-background-base border border-border-subtle rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold"
      >
        {commonIcons.map((icon) => (
          <option key={icon} value={icon}>
            {icon}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
