"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Unlock, Plus, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { useLayers, useMapStore } from "@/stores/map-store";
import type { MapLayer } from "@/types/world.type";

interface LayersPanelProps {
  worldLayers?: MapLayer[];
}

interface LayerUI {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  zIndex: number;
}

function mapLayerToUILayer(layer: MapLayer): LayerUI {
  return {
    id: layer.id,
    name: layer.name,
    visible: layer.isVisible,
    locked: false,
    opacity: layer.opacity,
    zIndex: layer.zIndex,
  };
}

function uiLayerToMapLayer(layer: LayerUI, gameWorldId: string): MapLayer {
  return {
    id: layer.id,
    name: layer.name,
    description: null,
    isVisible: layer.visible,
    opacity: layer.opacity,
    zIndex: layer.zIndex,
    gameWorldId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function LayersPanel({ worldLayers = [] }: LayersPanelProps) {
  const layers = useLayers();
  const toggleLayerVisibility = useMapStore((state) => state.toggleLayerVisibility);
  const toggleLayerLock = useMapStore((state) => state.toggleLayerLock);
  const updateLayerOpacity = useMapStore((state) => state.updateLayerOpacity);
  const moveLayerUp = useMapStore((state) => state.moveLayerUp);
  const moveLayerDown = useMapStore((state) => state.moveLayerDown);
  const addLayer = useMapStore((state) => state.addLayer);
  const removeLayer = useMapStore((state) => state.removeLayer);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLayerName, setNewLayerName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const handleToggleVisibility = (layerId: string) => {
    toggleLayerVisibility(layerId);
  };

  const handleToggleLock = (layerId: string) => {
    toggleLayerLock(layerId);
  };

  const handleOpacityChange = (layerId: string, opacity: number) => {
    updateLayerOpacity(layerId, opacity);
  };

  const handleMoveUp = (layerId: string) => {
    moveLayerUp(layerId);
  };

  const handleMoveDown = (layerId: string) => {
    moveLayerDown(layerId);
  };

  const handleAddLayer = () => {
    if (newLayerName.trim()) {
      const maxZIndex = layers.length > 0 ? Math.max(...layers.map((l) => l.zIndex)) : 0;
      addLayer({
        name: newLayerName.trim(),
        visible: true,
        locked: false,
        opacity: 1,
        zIndex: maxZIndex + 1,
      });
      setNewLayerName("");
      setShowAddDialog(false);
    }
  };

  const handleDeleteLayer = (layerId: string) => {
    removeLayer(layerId);
    setShowDeleteConfirm(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showDeleteConfirm) {
        handleCancelDelete();
      }
    };

    if (showDeleteConfirm) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [showDeleteConfirm]);

  const getLayerColor = (index: number) => {
    const colors = ["bg-accent-gold", "bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-rose-500"];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-1.5 text-xs text-accent-gold hover:text-accent-gold/80 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Layer
        </button>
      </div>

      {showAddDialog && (
        <div className="px-3 py-2 rounded-sm bg-background-elevated border border-border-subtle space-y-2">
          <input
            type="text"
            value={newLayerName}
            onChange={(e) => setNewLayerName(e.target.value)}
            placeholder="Layer name..."
            className="w-full px-2 py-1.5 text-sm bg-background-base border border-border-subtle rounded-sm focus:outline-none focus:border-accent-gold text-text-primary placeholder:text-text-muted"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddLayer();
              if (e.key === "Escape") setShowAddDialog(false);
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddLayer}
              className="flex-1 px-2 py-1 text-xs bg-accent-gold text-background-base rounded-sm hover:bg-accent-gold/90 transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowAddDialog(false)}
              className="flex-1 px-2 py-1 text-xs bg-background-base border border-border-subtle text-text-secondary rounded-sm hover:bg-background-elevated transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        {sortedLayers.length === 0 ? (
          <div className="px-3 py-6 text-center text-text-muted text-sm">
            No layers yet. Create one to get started.
          </div>
        ) : (
          sortedLayers.map((layer, index) => {
            const isConfirmingDelete = showDeleteConfirm === layer.id;

            return (
              <div
                key={layer.id}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated hover:bg-background-card-hover transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${getLayerColor(index)}`} />

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
                        onClick={() => handleMoveUp(layer.id)}
                        disabled={index === 0}
                        className="p-1 hover:bg-background-base rounded-sm disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-text-muted" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(layer.id)}
                        disabled={index === sortedLayers.length - 1}
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
                      onChange={(e) => handleOpacityChange(layer.id, parseInt(e.target.value) / 100)}
                      className="w-16 h-1 bg-background-base rounded-sm appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-gold"
                      title={`Opacity: ${Math.round(layer.opacity * 100)}%`}
                    />

                    <button
                      onClick={() => handleToggleVisibility(layer.id)}
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
                      onClick={() => handleToggleLock(layer.id)}
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
                      onClick={() => setShowDeleteConfirm(layer.id)}
                      className="p-1 hover:bg-background-base rounded-sm transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete layer"
                    >
                      <Trash2 className="w-3 h-3 text-text-muted hover:text-rose-500" />
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
                    <button
                      onClick={() => handleDeleteLayer(layer.id)}
                      className="px-2 py-1 text-xs bg-rose-600 text-white rounded-sm hover:bg-rose-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="p-1 hover:bg-background-base rounded-sm transition-colors text-text-muted hover:text-text-secondary"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
