"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileImage, FileText, Code, Loader2 } from "lucide-react";
import { exportMap, estimateFileSize, formatFileSize } from "../utils/export-utils";
import { generateExportFilename } from "../utils/filename-utils";
import type { ExportFormat, WorldExportData } from "@/actions/export";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  worldTitle: string;
  worldData: WorldExportData;
  mapElement: HTMLElement | null;
}

export function ExportDialog({
  open,
  onOpenChange,
  worldTitle,
  worldData,
  mapElement,
}: ExportDialogProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [filename, setFilename] = useState(worldTitle);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate filename with extension
  const generateFinalFilename = () => {
    return generateExportFilename(filename, format);
  };

  // Handle export
  const handleExport = async () => {
    setError(null);
    setIsExporting(true);

    try {
      const finalFilename = generateFinalFilename();
      await exportMap(mapElement, worldData, format, finalFilename);

      // Close dialog after successful export
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
      setIsExporting(false);
    }
  };

  // Estimate file size
  const estimatedSize = estimateFileSize(format, mapElement);

  // Handle format selection
  const handleFormatChange = (newFormat: ExportFormat) => {
    setFormat(newFormat);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background-card border-border-subtle">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">Export Map</DialogTitle>
          <DialogDescription className="text-sm text-text-muted mt-1">
            Choose a format to export your world. The exported file will be
            downloaded to your device.
          </DialogDescription>
        </DialogHeader>

          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label>Export Format</Label>
              <div className="space-y-2">
                <button
                  onClick={() => handleFormatChange("png")}
                  className={`w-full flex items-center gap-3 rounded-md border p-3 transition-colors text-left ${
                    format === "png"
                      ? "border-accent-gold bg-accent-gold/10"
                      : "border-border-subtle hover:bg-background-hover"
                  }`}
                >
                  <FileImage className="w-5 h-5 text-text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary">PNG Image</div>
                    <div className="text-sm text-text-muted">
                      High-quality image snapshot of your map
                    </div>
                  </div>
                  {format === "png" && (
                    <div className="w-4 h-4 rounded-full bg-accent-gold flex-shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => handleFormatChange("pdf")}
                  className={`w-full flex items-center gap-3 rounded-md border p-3 transition-colors text-left ${
                    format === "pdf"
                      ? "border-accent-gold bg-accent-gold/10"
                      : "border-border-subtle hover:bg-background-hover"
                  }`}
                >
                  <FileText className="w-5 h-5 text-text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary">PDF Document</div>
                    <div className="text-sm text-text-muted">
                      Portable document format for sharing and printing
                    </div>
                  </div>
                  {format === "pdf" && (
                    <div className="w-4 h-4 rounded-full bg-accent-gold flex-shrink-0" />
                  )}
                </button>

                <button
                  onClick={() => handleFormatChange("json")}
                  className={`w-full flex items-center gap-3 rounded-md border p-3 transition-colors text-left ${
                    format === "json"
                      ? "border-accent-gold bg-accent-gold/10"
                      : "border-border-subtle hover:bg-background-hover"
                  }`}
                >
                  <Code className="w-5 h-5 text-text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-text-primary">JSON Data</div>
                    <div className="text-sm text-text-muted">
                      Complete world data for backup and import
                    </div>
                  </div>
                  {format === "json" && (
                    <div className="w-4 h-4 rounded-full bg-accent-gold flex-shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Filename Input */}
            <div className="space-y-2">
              <Label htmlFor="filename">Filename</Label>
              <Input
                id="filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                className="w-full"
              />
              <p className="text-xs text-text-muted">
                Preview: {generateFinalFilename()}
              </p>
            </div>

            {/* File Size Estimate */}
            {estimatedSize > 0 && (
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <span>Estimated size:</span>
                <span className="font-medium text-text-primary">
                  {formatFileSize(estimatedSize)}
                </span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-500/10 border border-red-500 p-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>

        <DialogFooter className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border-subtle">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || !filename.trim()}
            className="gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
