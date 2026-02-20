"use client";

import { useCallback } from "react";
import { uploadWorldMap } from "@/features/worlds/actions";
import {
  DialogWrapper,
  FileUploadZone,
  FileUploadPreview,
  FileUploadError,
  FileUploadInfo,
  FileUploadActions,
} from "@/shared/ui/upload";
import { useUploadDialog } from "@/features/import/logic/use-upload-dialog";

interface UploadMapDialogProps {
  worldId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mapUrl: string) => void;
}

export function UploadMapDialog({
  worldId,
  isOpen,
  onClose,
  onSuccess,
}: UploadMapDialogProps) {
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
      validTypes: ["image/webp", "image/png", "image/jpeg", "image/jpg"],
      maxSize: 10 * 1024 * 1024,
      maxSizeLabel: "10MB",
    },
    {
      onUpload: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const _result = await uploadWorldMap(worldId, formData);
        if (result.success) onSuccess(result.data.mapUrl);
      },
      onSuccess: onClose,
    }
  );

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!isOpen) return null;

  return (
    <DialogWrapper title="Upload New Map" onClose={handleClose} disabled={isUploading}>
      <FileUploadZone
        previewUrl={previewUrl ?? ""}
        isUploading={isUploading}
        accept="image/webp,image/png,image/jpeg,image/jpg"
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
            fileSizeUnit="MB"
            onRemove={(e) => {
              e.stopPropagation();
              resetForm();
            }}
            disabled={isUploading}
          />
        ) : (
          <>
            <p className="text-sm text-text-secondary font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-text-muted">
              WebP, PNG, or JPEG (max 10MB)
            </p>
          </>
        )}
      </FileUploadZone>

      {error && <FileUploadError error={error} />}

      <FileUploadInfo message="The new map will replace the current base map. All pins and layers will be preserved." />

      <FileUploadActions
        isUploading={isUploading}
        hasFile={!!selectedFile}
        uploadLabel="Upload Map"
        onCancel={handleClose}
        onUpload={handleUpload}
      />
    </DialogWrapper>
  );
}
