'use client';

import * as React from 'react';
import { Upload, FileText, Globe, Image as ImageIcon, Loader2, X } from 'lucide-react';
import { useCreateImportJob, useProcessImportJob } from '@/hooks/use-import';
import { cn } from '@/lib/utils';

interface ImportDialogProps {
  worldId: string;
  onClose: () => void;
}

export function ImportDialog({ worldId, onClose }: ImportDialogProps) {
  const { mutate: createJob, isPending: isCreating } = useCreateImportJob();
  const { mutate: processJob, isPending: isProcessing } = useProcessImportJob();
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(undefined);
    const extension = file.name.split('.').pop()?.toLowerCase();

    let sourceType: 'JSON' | 'GEOJSON' | 'IMAGE' | 'KML' | 'URL' = 'JSON';
    let rawData: Record<string, unknown> = {};

    try {
      if (extension === 'json') {
        const text = await file.text();
        rawData = JSON.parse(text);
        // Check if it's GeoJSON
        if (rawData.type === 'FeatureCollection') {
          sourceType = 'GEOJSON';
        }
      } else if (extension === 'geojson') {
        const text = await file.text();
        rawData = JSON.parse(text);
        sourceType = 'GEOJSON';
      } else if (['png', 'jpg', 'jpeg', 'webp'].includes(extension ?? '')) {
        sourceType = 'IMAGE';
        // For now, create object URL - in production this would upload to storage
        rawData = {
          filename: file.name,
          url: URL.createObjectURL(file),
        };
      } else if (extension === 'kml') {
        sourceType = 'KML';
        const text = await file.text();
        rawData = { kml: text };
      } else {
        setError('Unsupported file format');
        return;
      }

      // Create and process job
      const result = await createJob({
        worldId,
        sourceType,
        filename: file.name,
        rawData,
      });

      if (result.success && result.data) {
        // Auto-process the job
        await processJob({ jobId: result.data.id });
        onClose();
      } else if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const isPending = isCreating || isProcessing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-1/2 rounded-sm bg-obsidian border border-iron shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-bone font-display">Import Data</h2>
          <button
            onClick={onClose}
            className="text-bone-dark/40 hover:text-bone transition-colors"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed p-8 text-center transition-colors rounded-sm',
            dragActive
              ? 'border-accent-gold bg-accent-gold/10'
              : 'border-iron hover:border-accent-gold/50'
          )}
        >
          {isPending ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-accent-gold" />
              <p className="text-bone-dark/60">
                {isCreating ? 'Creating import job...' : 'Importing...'}
              </p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto w-12 h-12 text-bone-dark/40 mb-4" />
              <p className="text-bone mb-2">
                Drop a file here or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.geojson,.png,.jpg,.jpeg,.webp,.kml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-4 py-2 bg-obsidian border border-accent-gold text-accent-gold rounded-sm hover:bg-accent-gold/10 transition-colors text-sm font-medium"
              >
                Browse Files
              </button>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-blood/10 border border-blood/30 rounded-sm">
            <p className="text-sm text-blood">{error}</p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-iron">
          <p className="text-xs text-bone-dark/50 mb-2">Supported formats:</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-bone-dark/60">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>JSON (world export)</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>GeoJSON</span>
            </div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Map images</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>KML</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
