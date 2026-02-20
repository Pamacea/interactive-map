"use client";

import { useState, useCallback, useRef } from "react";

interface FileValidationConfig {
  validTypes: string[];
  maxSize: number;
  maxSizeLabel: string;
}

interface UseFileUploadOptions {
  validationConfig: FileValidationConfig;
}

interface UseFileUploadReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  isUploading: boolean;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  resetForm: () => void;
  setUploading: (isUploading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useFileUpload({
  validationConfig,
}: UseFileUploadOptions): UseFileUploadReturn {
  const { validTypes, maxSize, maxSizeLabel } = validationConfig;
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

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!validTypes.includes(file.type)) {
        setError(
          `Invalid file type. Please upload ${validTypes.join(", ")}.`
        );
        return;
      }

      if (file.size > maxSize) {
        setError(`File size must be less than ${maxSizeLabel}`);
        return;
      }

      setError(null);
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [validTypes, maxSize, maxSizeLabel]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files[0];
      if (file) {
        const syntheticEvent = {
          target: { files: [file] },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleFileSelect(syntheticEvent);
      }
    },
    [handleFileSelect]
  );

  return {
    selectedFile,
    previewUrl,
    isUploading,
    error,
    fileInputRef,
    handleFileSelect,
    handleDragOver,
    handleDrop,
    resetForm,
    setUploading: setIsUploading,
    setError,
  };
}
