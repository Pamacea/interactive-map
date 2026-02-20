"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import { SkeletonSpinner } from "@/components/ui/skeleton";

interface FileUploadZoneProps {
  previewUrl: string | null;
  isUploading: boolean;
  accept: string;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  disabled?: boolean;
  previewClassName?: string;
  children?: React.ReactNode;
}

export function FileUploadZone({
  previewUrl,
  isUploading,
  accept,
  onFileSelect,
  onDragOver,
  onDrop,
  disabled = false,
  previewClassName: _previewClassName = "aspect-video w-full",
  children,
}: FileUploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-sm p-6 text-center transition-colors ${
        previewUrl
          ? "border-border-base bg-background-base"
          : "border-border-subtle hover:border-accent-gold hover:bg-background-hover cursor-pointer"
      }`}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={onFileSelect}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {children || (
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-sm bg-background-base">
            {isUploading ? (
              <SkeletonSpinner size="sm" />
            ) : (
              <Upload className="w-6 h-6 text-text-muted" />
            )}
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">
              Click to upload or drag and drop
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
