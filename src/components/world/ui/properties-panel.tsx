import { Switch } from "@/components/ui/switch";

export function PropertiesPanel() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Properties</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-background-elevated">
          <span className="text-sm text-text-secondary">Grid</span>
          <Switch />
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-background-elevated">
          <span className="text-sm text-text-secondary">Snap</span>
          <Switch />
        </div>

        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-background-elevated">
          <span className="text-sm text-text-secondary">Scale</span>
          <span className="text-xs font-display font-medium text-accent-gold">1:1000</span>
        </div>
      </div>
    </div>
  );
}
