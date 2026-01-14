import { FC } from "react";
import { PinTypeEnum } from "@/types/pin.type";
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

export interface FormPinTypeSelectorProps {
  value: PinTypeEnum;
  onChange: (value: PinTypeEnum) => void;
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
          Pin Type <span className="text-red-500 ml-1">*</span>
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as PinTypeEnum)}
          disabled={disabled}
          className={`h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
            error ? "border-red-500" : "border-slate-200"
          }`}
        >
          {PIN_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  const Icon = PIN_TYPE_OPTIONS.find((opt) => opt.value === value)?.icon || Circle;

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium leading-none">
        Pin Type <span className="text-red-500 ml-1">*</span>
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
              className={`flex flex-col items-center gap-2 p-3 rounded-md border transition-all ${
                value === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              } disabled:opacity-50`}
            >
              <OptIcon className="w-5 h-5" />
              <span className="text-xs">{option.label}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
