import { FC } from "react";
import { PinType } from "@/types/pin.type";
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
} from "lucide-react";

const PIN_TYPE_OPTIONS = [
  { value: PinType.CITY, label: "City", icon: Building2 },
  { value: PinType.VILLAGE, label: "Village", icon: Home },
  { value: PinType.POI, label: "Point of Interest", icon: MapPin },
  { value: PinType.CHARACTER, label: "Character", icon: User },
  { value: PinType.DUNGEON, label: "Dungeon", icon: Mountain },
  { value: PinType.SHOP, label: "Shop", icon: ShoppingBag },
  { value: PinType.QUEST, label: "Quest", icon: Scroll },
  { value: PinType.TREASURE, label: "Treasure", icon: Gem },
  { value: PinType.CUSTOM, label: "Custom", icon: Circle },
];

export interface FormPinTypeSelectorProps {
  value: (typeof PinType)[keyof typeof PinType];
  onChange: (value: (typeof PinType)[keyof typeof PinType]) => void;
  error?: string;
  mode?: "grid" | "select";
  disabled?: boolean;
}

export const FormPinTypeSelector: FC<FormPinTypeSelectorProps> = ({
  value,
  onChange,
  error,
  mode = "grid",
  disabled = false,
}) => {
  if (mode === "select") {
    return (
      <div className="grid gap-2">
        <label className="text-sm font-medium leading-none">
          Pin Type <span className="text-status-error ml-1">*</span>
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as (typeof PinType)[keyof typeof PinType])}
          disabled={disabled}
          className={`h-10 rounded-sm border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-interactive-focus disabled:opacity-50 bg-background-input ${
            error ? "border-status-error" : "border-input"
          }`}
        >
          {PIN_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-status-error">{error}</p>}
      </div>
    );
  }

  const Icon = PIN_TYPE_OPTIONS.find((opt) => opt.value === value)?.icon || Circle;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">
        Pin Type <span className="text-status-error ml-1">*</span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {PIN_TYPE_OPTIONS.map((option) => {
          const OptIcon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              disabled={disabled}
              className={`flex flex-col items-center gap-2 p-3 rounded-sm border transition-all ${
                value === option.value
                  ? "border-interactive-primary bg-interactive-selected"
                  : "border-input hover:border-hover"
              } disabled:opacity-50`}
            >
              <OptIcon className="w-5 h-5" />
              <span className="text-xs">{option.label}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-status-error">{error}</p>}
    </div>
  );
};
