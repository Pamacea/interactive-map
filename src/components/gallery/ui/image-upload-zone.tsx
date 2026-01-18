"use client";

import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  validateAndPrepareImage,
  formatFileSize,
  revokePreviewURL,
  createPreviewURL,
} from "../utils/image-utils";
import {
  IMAGE_MAX_SIZE,
  IMAGE_ALLOWED_TYPES,
} from "../logic/gallery-schemas";

interface FileWithPreview {
  file: File;
  preview: string;
  valid: boolean;
  error?: string;
}

interface ImageUploadZoneProps {
  onUpload?: (files: File[]) => void;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export function ImageUploadZone({
  onUpload,
  maxSize = IMAGE_MAX_SIZE,
  accept = IMAGE_ALLOWED_TYPES.join(","),
  multiple = true,
  className,
}: ImageUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileWithPreview[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const processedFiles: FileWithPreview[] = [];

    for (const file of fileArray) {
      const preview = createPreviewURL(file);
      const result = await validateAndPrepareImage(file);

      processedFiles.push({
        file,
        preview,
        valid: result.valid,
        error: result.valid ? undefined : result.error,
      });
    }

    setPendingFiles((prev) => [...prev, ...processedFiles]);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      await processFiles(files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        await processFiles(files);
      }
    },
    [processFiles]
  );

  const removePendingFile = useCallback((index: number) => {
    setPendingFiles((prev) => {
      const newFiles = [...prev];
      revokePreviewURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const handleUpload = useCallback(() => {
    const validFiles = pendingFiles.filter((f) => f.valid).map((f) => f.file);
    if (validFiles.length > 0 && onUpload) {
      onUpload(validFiles);
      // Clean up previews
      pendingFiles.forEach((f) => revokePreviewURL(f.preview));
      setPendingFiles([]);
    }
  }, [pendingFiles, onUpload]);

  const hasValidFiles = pendingFiles.some((f) => f.valid);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload zone */}
      <Card
        className={cn(
          "relative border-2 border-dashed transition-colors duration-200",
          isDragging
            ? "border-accent-gold bg-accent-gold/10"
            : "border-border-subtle hover:border-border-ornate"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8">
          <input
            type="file"
            id="image-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
          />

          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 bg-background-elevated rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-accent-gold" />
            </div>

            <div>
              <p className="text-text-primary font-medium">
                Drop images here or click to upload
              </p>
              <p className="text-text-secondary text-sm mt-1">
                PNG, JPG, WEBP up to {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending files */}
      {pendingFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-text-primary">
              Ready to upload ({pendingFiles.filter((f) => f.valid).length})
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              disabled={!hasValidFiles}
            >
              Upload All
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pendingFiles.map((fileWithPreview, index) => (
              <Card
                key={index}
                className={cn(
                  "relative aspect-square bg-background-card overflow-hidden",
                  !fileWithPreview.valid && "opacity-50"
                )}
              >
                <CardContent className="p-0 h-full">
                  <img
                    src={fileWithPreview.preview}
                    alt={fileWithPreview.file.name}
                    className="w-full h-full object-cover"
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-full"
                    onClick={() => removePendingFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                    <p className="text-white text-xs truncate">
                      {fileWithPreview.file.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      {formatFileSize(fileWithPreview.file.size)}
                    </p>
                    {fileWithPreview.error && (
                      <p className="text-red-400 text-xs mt-1">
                        {fileWithPreview.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload info */}
      <div className="text-center text-xs text-text-secondary space-y-1">
        <p>Supported formats: PNG, JPG, WEBP, GIF</p>
        <p>Maximum file size: {formatFileSize(maxSize)}</p>
      </div>
    </div>
  );
}
