import { getPinTypeOptions } from "@/constants/pin-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
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
    <div className="px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50">
      <label className="block text-xs font-display text-bone-dark mb-2 uppercase tracking-wide">Pin Type</label>
      <Select value={value} onValueChange={onUpdate} disabled={disabled}>
        <SelectTrigger className="w-full bg-void/50 border border-iron/30 rounded text-sm text-bone focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/30 transition-all disabled:opacity-50 px-3 py-2 h-auto font-fell">
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
