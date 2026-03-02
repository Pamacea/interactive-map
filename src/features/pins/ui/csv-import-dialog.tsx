"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { X, Upload, FileText, Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { importPinsFromCSV } from "@/features/pins/actions/import-csv";
import { useQueryClient } from "@tanstack/react-query";
import { galleryKeys } from "@/features/gallery/logic/use-gallery-query";

interface CSVImportDialogProps {
  worldId: string;
  layerId?: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CSVImportDialog({
  worldId,
  layerId,
  open,
  onClose,
  onSuccess,
}: CSVImportDialogProps) {
  const [csvContent, setCsvContent] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ created: number } | null>(null);
  const queryClient = useQueryClient();

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      setError(null);
      setResult(null);
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
  }, []);

  const handleImport = async () => {
    if (!csvContent.trim()) {
      setError("Please enter CSV content or select a file");
      return;
    }

    setIsImporting(true);
    setError(null);

    try {
      const response = await importPinsFromCSV(worldId, csvContent, layerId);

      if (response.success && response.data) {
        setResult({ created: response.data.created });
        // Refresh queries
        queryClient.invalidateQueries({ queryKey: galleryKeys.world(worldId) });
      } else if (response.error) {
        setError(response.error.message || "Failed to import pins");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import pins");
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setCsvContent("");
    setError(null);
    setResult(null);
    onClose();
  };

  const handleDone = () => {
    onSuccess();
    handleClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-sm bg-obsidian border border-iron shadow-xl p-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent-gold" />
            <h2 className="text-lg font-semibold text-text-primary">Import Pins from CSV</h2>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!result ? (
            <>
              {/* Instructions */}
              <div className="mb-4 p-3 rounded-sm bg-white/5 border border-border-subtle text-sm">
                <p className="font-medium text-text-primary mb-2">CSV Format:</p>
                <code className="text-xs text-text-secondary">
                  title, description, latitude, longitude, icon, color, type
                </code>
                <p className="text-xs text-text-muted mt-2">
                  Required: title, latitude, longitude. Optional: description, icon, color, type
                </p>
              </div>

              {/* File upload */}
              <div className="mb-4">
                <Label htmlFor="csv-file">Upload CSV File</Label>
                <div className="mt-2">
                  <input
                    id="csv-file"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label htmlFor="csv-file">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full cursor-pointer"
                      as="span"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select CSV File
                    </Button>
                  </label>
                </div>
              </div>

              {/* Manual entry */}
              <div className="mb-4">
                <Label htmlFor="csv-content">Or Paste CSV Content</Label>
                <textarea
                  id="csv-content"
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="title,description,latitude,longitude,icon,color,type&#10;Castle,Main fortress,51.5074,-0.1278,🏰,#ff0000,CITY&#10;Village,Small village,51.5174,-0.1378,🏡,#00ff00,VILLAGE"
                  className="w-full h-40 px-3 py-2 bg-background-input border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none resize-y font-mono"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 p-3 rounded-sm bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Success */}
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Download className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Import Complete!</h3>
                <p className="text-text-secondary mb-6">
                  Successfully imported <span className="text-accent-gold font-bold">{result.created}</span> pins
                </p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isImporting}
          >
            Cancel
          </Button>
          {!result ? (
            <Button
              onClick={handleImport}
              disabled={!csvContent.trim() || isImporting}
              className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
            >
              {isImporting ? "Importing..." : "Import Pins"}
            </Button>
          ) : (
            <Button
              onClick={handleDone}
              className="bg-accent-gold/20 text-accent-gold hover:bg-accent-gold/30"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
