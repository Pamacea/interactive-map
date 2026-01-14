"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface IconUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  pinId?: string;
}

export function IconUploadDialog({
  isOpen,
  onClose,
  onUpload,
  pinId,
}: IconUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/svg+xml", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload an SVG, PNG, or WEBP image.");
      return;
    }

    // Validate file size (max 500KB)
    const maxSize = 500 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 500KB");
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile);
      resetForm();
      onClose();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload icon";
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onUpload, onClose, resetForm]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(syntheticEvent);
    }
  }, [handleFileSelect]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-background-elevated border border-border-base rounded-lg shadow-lg max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-base">
          <h2 className="text-lg font-semibold text-text-primary">
            Upload Custom Icon
          </h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-1 hover:bg-background-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* File input area */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              previewUrl
                ? "border-border-base bg-background-base"
                : "border-border-subtle hover:border-accent-gold hover:bg-background-hover cursor-pointer"
            }`}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".svg,.png,.webp,image/svg+xml,image/png,image/webp"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />

            {previewUrl ? (
              <div className="space-y-3">
                <div className="w-32 h-32 mx-auto flex items-center justify-center overflow-hidden rounded-md bg-background-base">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-sm text-text-muted">
                  <p className="font-medium text-text-secondary truncate">
                    {selectedFile?.name}
                  </p>
                  <p className="text-xs">
                    {((selectedFile?.size || 0) / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetForm();
                  }}
                  disabled={isUploading}
                  className="text-sm text-accent-gold hover:text-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose different file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-full bg-background-base">
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-accent-gold animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-text-muted" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-text-secondary font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    SVG, PNG, or WEBP (max 500KB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-950/30 border border-rose-900/50 rounded-md">
              <X className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-rose-300">{error}</p>
            </div>
          )}

          {/* Info message */}
          <div className="flex items-start gap-2 p-3 bg-blue-950/30 border border-blue-900/50 rounded-md">
            <ImageIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-300">
              Custom icons will be saved to your world and can be used for any
              pin.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border-base">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-hover rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="px-4 py-2 text-sm font-medium bg-accent-gold text-text-primary rounded-md hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Icon
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
