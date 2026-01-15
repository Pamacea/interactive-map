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
      className={`flex items-center justify-between px-3 py-2 rounded-sm bg-background-elevated transition-colors ${
        disabled ? "opacity-50" : ""
      } border border-border-subtle`}
    >
      <span className="text-sm text-text-secondary">Visible</span>
      <Switch
        checked={isVisible}
        onCheckedChange={onUpdate}
      />
    </div>
  );
}
