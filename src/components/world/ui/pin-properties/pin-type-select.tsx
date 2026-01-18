import { getPinTypeOptions } from "@/constants/pin-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
      <Select value={value} onValueChange={onUpdate} disabled={disabled}>
        <SelectTrigger className="w-full bg-transparent text-sm text-text-primary focus:outline-none disabled:opacity-50 border-0 p-0 h-auto focus:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pinTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
