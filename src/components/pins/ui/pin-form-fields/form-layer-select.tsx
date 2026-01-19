import { FC } from "react";

export interface Layer {
  id: string;
  name: string;
}

export interface FormLayerSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  layers: Layer[];
  error?: string;
  disabled?: boolean;
}

export const FormLayerSelect: FC<FormLayerSelectProps> = ({
  label,
  value,
  onChange,
  layers,
  error,
  disabled = false,
}) => {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-interactive-focus disabled:opacity-50 bg-background-input ${
          error ? "border-status-error" : "border-input"
        }`}
      >
        <option value="">No layer</option>
        {layers.map((layer) => (
          <option key={layer.id} value={layer.id}>
            {layer.name}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
