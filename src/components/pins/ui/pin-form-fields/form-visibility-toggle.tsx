import { FC } from "react";
import { Switch } from "@/components/ui/switch";
import { Eye, EyeOff } from "lucide-react";

export interface FormVisibilityToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const FormVisibilityToggle: FC<FormVisibilityToggleProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className={`flex items-center justify-between py-2`}>
      <div className="flex items-center gap-2">
        {checked ? (
          <Eye className="w-4 h-4 text-slate-600" />
        ) : (
          <EyeOff className="w-4 h-4 text-slate-400" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};
