"use client";

import { useState, useCallback } from "react";

export interface UseUploadDialogReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  isDragging: boolean;
  isUploading: boolean;
  error: string | null;
  handleFileSelect: (file: File) => void;
  handleDrop: useCallback;
  handleDragOver: useCallback;
  handleDragLeave: useCallback;
  removeFile: () => void;
  resetDialog: () => void;
}

export function useUploadDialog(): UseUploadDialogReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  }, []);

  const resetDialog = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsDragging(false);
    setIsUploading(false);
    setError(null);
  }, []);

  return {
    selectedFile,
    previewUrl,
    isDragging,
    isUploading,
    error,
    handleFileSelect,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    removeFile,
    resetDialog,
  };
}
