"use client";

import { useCallback } from "react";
import {
  DialogWrapper,
  FileUploadZone,
  FileUploadPreview,
  FileUploadError,
  FileUploadInfo,
  FileUploadActions,
} from "@/components/ui/upload";
import { useUploadDialog } from "@/components/logic/use-upload-dialog";

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
}: IconUploadDialogProps) {
  const {
    selectedFile,
    previewUrl,
    isUploading,
    error,
    handleFileSelect,
    handleDragOver,
    handleDrop,
    handleUpload,
    resetForm,
  } = useUploadDialog(
    {
      validTypes: ["image/svg+xml", "image/png", "image/webp"],
      maxSize: 500 * 1024,
      maxSizeLabel: "500KB",
    },
    {
      onUpload,
      onSuccess: onClose,
    }
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!isOpen) return null;

  return (
    <DialogWrapper title="Upload Custom Icon" onClose={handleClose} disabled={isUploading}>
      <FileUploadZone
        previewUrl={previewUrl ?? ""}
        isUploading={isUploading}
        accept=".svg,.png,.webp,image/svg+xml,image/png,image/webp"
        onFileSelect={handleFileSelect}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        disabled={isUploading}
      >
        {previewUrl && selectedFile ? (
          <FileUploadPreview
            previewUrl={previewUrl}
            fileName={selectedFile.name}
            fileSize={selectedFile.size}
            fileSizeUnit="KB"
            onRemove={(e) => {
              e.stopPropagation();
              resetForm();
            }}
            disabled={isUploading}
            previewClassName="w-32 h-32 mx-auto"
          />
        ) : (
          <>
            <p className="text-sm text-text-secondary font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-text-muted">
              SVG, PNG, or WEBP (max 500KB)
            </p>
          </>
        )}
      </FileUploadZone>

      {error && <FileUploadError error={error} />}

      <FileUploadInfo message="Custom icons will be saved to your world and can be used for any pin." />

      <FileUploadActions
        isUploading={isUploading}
        hasFile={!!selectedFile}
        uploadLabel="Upload Icon"
        onCancel={handleClose}
        onUpload={handleUpload}
      />
    </DialogWrapper>
  );
}
