import { Eye, EyeOff, Lock } from "lucide-react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
}

export function LayersPanel() {
  const layers: Layer[] = [
    { id: "1", name: "Base Map", visible: true, locked: false, color: "bg-accent-gold" },
    { id: "2", name: "Markers", visible: true, locked: false, color: "bg-blue-500" },
    { id: "3", name: "Regions", visible: false, locked: true, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide">Layers</h3>
        <button className="text-xs text-accent-gold hover:text-accent-gold-dark transition-colors">
          + Add
        </button>
      </div>

      <div className="space-y-1.5">
        {layers.map((layer) => (
          <div
            key={layer.id}
            className="group flex items-center gap-2 px-3 py-2 rounded-md bg-background-elevated hover:bg-background-card-hover transition-colors cursor-pointer"
          >
            <div className={`w-2.5 h-2.5 rounded-full ${layer.color}`} />
            <span className={`flex-1 text-sm ${layer.visible ? "text-text-secondary" : "text-text-muted"}`}>
              {layer.name}
            </span>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              {layer.visible ? <Eye className="w-3.5 h-3.5 text-text-muted" /> : <EyeOff className="w-3.5 h-3.5 text-text-muted" />}
            </button>
            {layer.locked && <Lock className="w-3 h-3 text-text-muted" />}
          </div>
        ))}
      </div>
    </div>
  );
}
