/**
 * PropertyImageUpload - Reusable image upload component for property panels
 *
 * Features:
 * - Drag and drop
 * - Image preview
 * - Size validation
 * - Type validation
 * - Progress indicator
 * - Remove/clear option
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, Image as ImageIcon, X, Check, AlertCircle } from "lucide-react";

export interface PropertyImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  containerClassName?: string;
  previewClassName?: string;
}

export function PropertyImageUpload({
  value,
  onChange,
  onUpload,
  disabled,
  accept = "image/png,image/webp,image/svg+xml,image/jpeg",
  maxSize = 10 * 1024 * 1024, // 10MB
  label = "Image",
  containerClassName,
  previewClassName,
}: PropertyImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const dropZoneRef = React.useRef<HTMLDivElement>(null);

  const allowedTypes = accept.split(",");

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed: ${allowedTypes.join(", ")}`;
    }
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress (in real app, use actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const url = await onUpload(file);

      clearInterval(progressInterval);
      setUploadProgress(100);
      onChange(url);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only reset if leaving the drop zone itself
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  const clearError = () => setError(null);

  return (
    <div className={cn("space-y-2", containerClassName)}>
      <span className="text-xs font-display text-text-muted uppercase tracking-wide">
        {label}
      </span>

      {/* Upload area / Preview */}
      <div
        ref={dropZoneRef}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "relative border-2 border-dashed rounded-sm overflow-hidden transition-colors cursor-pointer",
          isDragging
            ? "border-accent-gold bg-accent-gold/10"
            : "border-border-subtle hover:border-accent-gold/50 hover:bg-white/5",
          disabled && "opacity-50 cursor-not-allowed",
          previewClassName
        )}
      >
        {value ? (
          // Preview mode
          <div className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                disabled={disabled || isUploading}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                title="Change image"
              >
                <Upload className="w-5 h-5 text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled}
                className="p-2 bg-white/20 rounded-full hover:bg-red-500/80 transition-colors"
                title="Remove image"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        ) : (
          // Upload prompt
          <div className="flex flex-col items-center justify-center py-8 px-4">
            {isUploading ? (
              <>
                <div className="w-12 h-12 rounded-full border-2 border-accent-gold/30 border-t-accent-gold animate-spin mb-3" />
                <p className="text-sm text-text-primary">Uploading...</p>
                <p className="text-xs text-text-muted mt-1">{uploadProgress}%</p>
              </>
            ) : (
              <>
                <div className={cn(
                  "w-12 h-12 rounded-full bg-background-input flex items-center justify-center mb-3 transition-colors",
                  isDragging ? "text-accent-gold" : "text-text-muted"
                )}>
                  <ImageIcon className="w-6 h-6" />
                </div>
                <p className="text-sm text-text-primary">
                  {isDragging ? "Drop image here" : "Click or drag to upload"}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  PNG, WebP, SVG up to {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              </>
            )}
          </div>
        )}

        {/* Progress bar */}
        {isUploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
            <div
              className="h-full bg-accent-gold transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-sm">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-red-400">{error}</p>
          </div>
          <button
            type="button"
            onClick={clearError}
            className="text-text-muted hover:text-text-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload success indicator */}
      {value && !isUploading && !error && (
        <div className="flex items-center gap-2 text-xs text-green-400">
          <Check className="w-4 h-4" />
          <span>Image uploaded successfully</span>
        </div>
      )}
    </div>
  );
}
