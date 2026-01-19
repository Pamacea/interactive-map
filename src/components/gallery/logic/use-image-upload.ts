import { useCallback, useState } from "react";
import {
  validateAndPrepareImage,
  revokePreviewURL,
  createPreviewURL,
} from "../utils/image-utils";

export interface FileWithPreview {
  file: File;
  preview: string;
  valid: boolean;
  error?: string;
}

interface UseImageUploadOptions {
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  onUpload?: (files: File[]) => void;
}

interface UseImageUploadReturn {
  pendingFiles: FileWithPreview[];
  hasValidFiles: boolean;
  isUploading: boolean;
  uploadErrors: string[];
  processFiles: (files: FileList | File[]) => Promise<void>;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removePendingFile: (index: number) => void;
  handleUpload: () => void;
  clearPendingFiles: () => void;
}

/**
 * Custom hook for handling image upload logic
 * Manages file validation, preview generation, and upload state
 */
export function useImageUpload({
  maxSize,
  accept,
  multiple,
  onUpload,
}: UseImageUploadOptions = {}): UseImageUploadReturn {
  const [pendingFiles, setPendingFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const processedFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    for (const file of fileArray) {
      const preview = createPreviewURL(file);
      const result = await validateAndPrepareImage(file);

      if (!result.valid && result.error) {
        errors.push(result.error);
      }

      processedFiles.push({
        file,
        preview,
        valid: result.valid,
        error: result.valid ? undefined : result.error,
      });
    }

    setPendingFiles((prev) => [...prev, ...processedFiles]);

    if (errors.length > 0) {
      setUploadErrors(errors);
    }
  }, []);

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        await processFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
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

    if (validFiles.length === 0) {
      return;
    }

    setIsUploading(true);

    try {
      if (onUpload) {
        onUpload(validFiles);
      }

      // Clean up previews
      pendingFiles.forEach((f) => revokePreviewURL(f.preview));
      setPendingFiles([]);
      setUploadErrors([]);
    } catch (error) {
      setUploadErrors([
        error instanceof Error ? error.message : "Upload failed",
      ]);
    } finally {
      setIsUploading(false);
    }
  }, [pendingFiles, onUpload]);

  const clearPendingFiles = useCallback(() => {
    pendingFiles.forEach((f) => revokePreviewURL(f.preview));
    setPendingFiles([]);
    setUploadErrors([]);
  }, [pendingFiles]);

  const hasValidFiles = pendingFiles.some((f) => f.valid);

  return {
    pendingFiles,
    hasValidFiles,
    isUploading,
    uploadErrors,
    processFiles,
    handleFileInput,
    removePendingFile,
    handleUpload,
    clearPendingFiles,
  };
}
