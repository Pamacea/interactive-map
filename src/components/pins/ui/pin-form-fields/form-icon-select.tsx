import { FC } from "react";
import {
  MapPin,
  Building2,
  Home,
  Mountain,
  ShoppingBag,
  Scroll,
  Gem,
  Circle,
  User,
  Castle,
  Package,
  Skull,
  Store,
  Flag,
  CircleDot,
} from "lucide-react";

const ICONS = {
  "map-pin": MapPin,
  building: Building2,
  home: Home,
  mountain: Mountain,
  "shopping-bag": ShoppingBag,
  scroll: Scroll,
  gem: Gem,
  circle: Circle,
  user: User,
  castle: Castle,
  chest: Package,
  skull: Skull,
  store: Store,
  flag: Flag,
  dot: CircleDot,
};

export interface FormIconSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const FormIconSelect: FC<FormIconSelectProps> = ({
  label,
  value,
  onChange,
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
        className={`h-10 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
          error ? "border-red-500" : "border-slate-200"
        }`}
      >
        <option value="">Default icon</option>
        {Object.entries(ICONS).map(([iconName, IconComponent]) => (
          <option key={iconName} value={iconName}>
            {iconName}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
