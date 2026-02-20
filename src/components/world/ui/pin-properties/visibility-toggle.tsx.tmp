import { Switch } from "@/components/ui/switch";

interface VisibilityToggleProps {
  isVisible: boolean;
  disabled: boolean;
  onUpdate: (value: boolean) => void;
}

export function VisibilityToggle({
  isVisible,
  disabled,
  onUpdate,
}: VisibilityToggleProps) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2.5 bg-obsidian/60 border-x border-b border-iron/50 transition-colors ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <span className="text-sm text-bone-dark font-fell">Visible</span>
      <Switch
        checked={isVisible}
        onCheckedChange={onUpdate}
      />
    </div>
  );
}
