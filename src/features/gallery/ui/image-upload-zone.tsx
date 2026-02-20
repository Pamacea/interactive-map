"use client";

import { Upload, X } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/ui/card";
import { formatFileSize } from "../utils/image-utils";
import {
  IMAGE_MAX_SIZE,
  IMAGE_ALLOWED_TYPES,
} from "../logic/gallery-schemas";
import { useImageUpload, FileWithPreview } from "../logic/use-image-upload";
import { useDragAndDrop } from "../logic/use-drag-and-drop";

export interface ImageUploadZoneProps {
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
  const {
    pendingFiles,
    hasValidFiles,
    isUploading,
    processFiles,
    handleFileInput,
    removePendingFile,
    handleUpload,
  } = useImageUpload({
    maxSize,
    accept,
    multiple,
    onUpload,
  });

  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: async (e) => {
      const files = e.dataTransfer.files;
      await processFiles(files);
    },
  });

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
        {...dragHandlers}
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
            <div className="w-16 h-16 bg-background-elevated rounded-sm flex items-center justify-center">
              <Upload className="w-8 h-8 text-accent-gold" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-text-primary font-medium">
                Drop images here or click to upload
              </p>
              <p className="text-text-secondary text-sm">
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
              disabled={!hasValidFiles || isUploading}
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
                    className="absolute top-2 right-2 h-8 w-8 bg-black/60 hover:bg-black/80 text-white rounded-sm"
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
                      <p className="text-red-400 text-xs">
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
      <div className="flex flex-col gap-1 text-center text-xs text-text-secondary">
        <p>Supported formats: PNG, JPG, WEBP, GIF</p>
        <p>Maximum file size: {formatFileSize(maxSize)}</p>
      </div>
    </div>
  );
}
