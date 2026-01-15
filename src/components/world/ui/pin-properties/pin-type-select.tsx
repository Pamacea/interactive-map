import { getPinTypeOptions } from "@/constants/pin-types";
import type { Pin } from "@prisma/client";

interface PinTypeSelectProps {
  value: Pin["pinType"];
  disabled: boolean;
  onUpdate: (value: Pin["pinType"]) => void;
}

export function PinTypeSelect({
  value,
  disabled,
  onUpdate,
}: PinTypeSelectProps) {
  const pinTypeOptions = getPinTypeOptions();

  return (
    <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle">
      <label className="block text-xs text-text-muted mb-1.5">Pin Type</label>
      <select
        value={value}
        onChange={(e) => onUpdate(e.target.value as Pin["pinType"])}
        disabled={disabled}
        className="w-full bg-transparent text-sm text-text-primary focus:outline-none disabled:opacity-50"
      >
        {pinTypeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
