"use client";

import React, { useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { PinDetailsContent } from "@/components/pins/ui/pin-details-content";
import {
  useSelectedPinId,
  useClearSelection,
  useUpdatePinServer,
  useDeletePinServer,
} from "@/stores/use-pins-store";
import { usePinById } from "@/stores/use-pins-store";
import { useShowPanel, useHidePanel, usePanelState } from "@/store/use-floating-panels-store";
import type { OptimizedWorldLayer } from "@/types/world.type";

interface PinDetailsModuleProps {
  worldId: string;
  worldLayers?: OptimizedWorldLayer[];
}

export function PinDetailsModule({ worldId, worldLayers = [] }: PinDetailsModuleProps) {
  const selectedPinId = useSelectedPinId();
  const clearSelection = useClearSelection();
  const pin = usePinById(selectedPinId ?? "");
  const updatePinServer = useUpdatePinServer();
  const deletePinServer = useDeletePinServer();
  const showPanel = useShowPanel();
  const hidePanel = useHidePanel();
  const panelState = usePanelState("pin-details");

  // Track if we just closed the panel to avoid loop
  const justClosedRef = useRef(false);

  // Get layer name if pin has a layer
  const layerName = pin?.layerId
    ? worldLayers.find((layer) => layer.id === pin.layerId)?.name
    : undefined;

  // Auto-show panel when pin is selected
  useEffect(() => {
    if (selectedPinId && pin && !panelState.isVisible) {
      justClosedRef.current = false;
      showPanel("pin-details");
    }
  }, [selectedPinId, pin, showPanel, panelState.isVisible]);

  // Custom close handler
  const handleClose = () => {
    justClosedRef.current = true;
    clearSelection();
    hidePanel("pin-details");
  };

  const handleTitleChange = async (newTitle: string) => {
    if (!pin) return;
    try {
      await updatePinServer({ id: pin.id, title: newTitle });
    } catch (error) {
      console.error("Failed to update pin title:", error);
    }
  };

  const handleDescriptionChange = async (newDescription: string) => {
    if (!pin) return;
    try {
      await updatePinServer({ id: pin.id, description: newDescription });
    } catch (error) {
      console.error("Failed to update pin description:", error);
    }
  };

  const handleDelete = async () => {
    if (!pin) return;
    try {
      await deletePinServer(pin.id);
      clearSelection();
    } catch (error) {
      console.error("Failed to delete pin:", error);
    }
  };

  const handleToggleVisibility = async () => {
    if (!pin) return;
    try {
      await updatePinServer({ id: pin.id, isVisible: !pin.isVisible });
    } catch (error) {
      console.error("Failed to toggle pin visibility:", error);
    }
  };

  return (
    <FloatingPanel
      panelId="pin-details"
      title="Pin Details"
      icon={<MapPin className="w-4 h-4" />}
      showClose={false}
      actions={
        <button
          type="button"
          onClick={handleClose}
          className="p-1 text-bone-dark/60 hover:text-blood hover:bg-blood/10 rounded-sm transition-colors"
          aria-label="Close panel"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      }
    >
      {!pin || !selectedPinId ? (
        <div className="flex items-center justify-center h-full min-h-40 p-8 text-center">
          <div className="space-y-2">
            <MapPin className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm text-text-muted">No pin selected</p>
            <p className="text-xs text-text-muted">
              Click on a pin to view its details
            </p>
          </div>
        </div>
      ) : (
        <PinDetailsContent
          pin={pin}
          layerName={layerName}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onDelete={handleDelete}
          onToggleVisibility={handleToggleVisibility}
          worldId={worldId}
        />
      )}
    </FloatingPanel>
  );
}
