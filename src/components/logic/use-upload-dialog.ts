"use client";

import { useCallback } from "react";
import { useFileUpload } from "./use-file-upload";

interface UseUploadDialogOptions {
  validTypes: string[];
  maxSize: number;
  maxSizeLabel: string;
}

interface UseUploadDialogProps {
  onUpload: (file: File) => Promise<void>;
  onSuccess?: () => void;
}

export function useUploadDialog(
  { validTypes, maxSize, maxSizeLabel }: UseUploadDialogOptions,
  { onUpload, onSuccess }: UseUploadDialogProps
) {
  const {
    selectedFile,
    previewUrl,
    isUploading,
    error,
    handleFileSelect,
    handleDragOver,
    handleDrop,
    resetForm,
    setUploading,
    setError,
  } = useFileUpload({
    validationConfig: {
      validTypes,
      maxSize,
      maxSizeLabel,
    },
  });

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await onUpload(selectedFile);
      onSuccess?.();
      resetForm();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload file";
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  }, [selectedFile, onUpload, onSuccess, resetForm, setUploading, setError]);

  return {
    selectedFile,
    previewUrl,
    isUploading,
    error,
    handleFileSelect,
    handleDragOver,
    handleDrop,
    handleUpload,
    resetForm,
  };
}
