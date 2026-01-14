import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
}

interface LayerItemProps {
  layer: Layer;
  index: number;
  isConfirmingDelete: boolean;
  layerColor: string;
  onToggleVisibility: (layerId: string) => void;
  onToggleLock: (layerId: string) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onMoveUp: (layerId: string) => void;
  onMoveDown: (layerId: string) => void;
  onDeleteConfirm: (layerId: string) => void;
  onDeleteCancel: () => void;
  onStartDelete: (layerId: string) => void;
  totalLayers: number;
}

export function LayerItem({
  layer,
  index,
  isConfirmingDelete,
  layerColor,
  onToggleVisibility,
  onToggleLock,
  onOpacityChange,
  onMoveUp,
  onMoveDown,
  onDeleteConfirm,
  onDeleteCancel,
  onStartDelete,
  totalLayers,
}: LayerItemProps) {
  return (
    <div
      key={layer.id}
      className="group relative flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated hover:bg-background-card-hover transition-colors"
    >
      <div className={`w-2 h-2 rounded-full ${layerColor}`} />

      <span
        className={`flex-1 text-sm truncate ${
          layer.visible ? "text-text-secondary" : "text-text-muted"
        }`}
      >
        {layer.name}
      </span>

      {!isConfirmingDelete ? (
        <>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onMoveUp(layer.id)}
              disabled={index === 0}
              className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move up"
            >
              <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
            </button>
            <button
              onClick={() => onMoveDown(layer.id)}
              disabled={index === totalLayers - 1}
              className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Move down"
            >
              <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
            </button>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={layer.opacity * 100}
            onChange={(e) => onOpacityChange(layer.id, parseInt(e.target.value) / 100)}
            className="w-16 h-1 bg-background-base rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold"
            title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
          />

          <button
            onClick={() => onToggleVisibility(layer.id)}
            className="p-1 hover:bg-background-base rounded-sm transition-colors"
            title={layer.visible ? "Hide layer" : "Show layer"}
          >
            {layer.visible ? (
              <Eye className="w-3.5 h-3.5 text-text-muted" />
            ) : (
              <EyeOff className="w-3.5 h-3.5 text-text-muted" />
            )}
          </button>

          <button
            onClick={() => onToggleLock(layer.id)}
            className="p-1 hover:bg-background-base rounded-sm transition-colors"
            title={layer.locked ? "Unlock layer" : "Lock layer"}
          >
            {layer.locked ? (
              <Lock className="w-3 h-3 text-text-muted" />
            ) : (
              <Unlock className="w-3 h-3 text-text-muted" />
            )}
          </button>

          <button
            onClick={() => onStartDelete(layer.id)}
            className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100"
            title="Delete layer"
          >
            <Trash2 className="w-3 h-3 text-text-muted hover:text-rose-500" />
          </button>
        </>
      ) : (
        <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
          <button
            onClick={() => onDeleteConfirm(layer.id)}
            className="px-2 py-1 text-xs bg-rose-600 text-white rounded-sm hover:bg-rose-700 transition-colors font-medium"
          >
            Delete
          </button>
          <button
            onClick={onDeleteCancel}
            className="p-1 hover:bg-background-base rounded-sm transition-colors text-text-muted hover:text-text-secondary"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
