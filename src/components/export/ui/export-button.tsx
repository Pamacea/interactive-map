"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { ExportDialog } from "./export-dialog";
import { getWorldExportData } from "@/actions/export";
import type { WorldExportData } from "@/actions/export";

interface ExportButtonProps {
  worldId: string;
  worldTitle: string;
  mapElement: HTMLElement | null;
}

export function ExportButton({ worldId, worldTitle, mapElement }: ExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [worldData, setWorldData] = useState<WorldExportData | null>(null);

  // Load world data when dialog opens
  const handleOpenChange = useCallback(
    async (newOpen: boolean) => {
      if (newOpen && !worldData) {
        setLoading(true);
        try {
          const result = await getWorldExportData(worldId);
          if (result.error) {
            console.error("[ExportButton] Failed to load world data:", result.error);
            setLoading(false);
            return;
          }
          setWorldData(result.data);
          setLoading(false);
        } catch (error) {
          console.error("[ExportButton] Failed to load world data:", error);
          setLoading(false);
          return;
        }
      }
      setOpen(newOpen);
    },
    [worldId, worldData]
  );

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleOpenChange(true)}
        disabled={loading}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </Button>

      {worldData && (
        <ExportDialog
          open={open}
          onOpenChange={handleOpenChange}
          worldTitle={worldTitle}
          worldData={worldData}
          mapElement={mapElement}
        />
      )}
    </>
  );
}
