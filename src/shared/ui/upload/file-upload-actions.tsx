"use client";

import { Upload } from "lucide-react";
import { SkeletonSpinner } from "@/shared/ui/skeleton";

interface FileUploadActionsProps {
  isUploading: boolean;
  hasFile: boolean;
  uploadLabel: string;
  onCancel: () => void;
  onUpload: () => void;
}

export function FileUploadActions({
  isUploading,
  hasFile,
  uploadLabel,
  onCancel,
  onUpload,
}: FileUploadActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border-base">
      <button
        onClick={onCancel}
        disabled={isUploading}
        className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-hover rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Cancel
      </button>
      <button
        onClick={onUpload}
        disabled={!hasFile || isUploading}
        className="px-4 py-2 text-sm font-medium bg-accent-gold text-text-primary rounded-sm hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isUploading ? (
          <>
            <SkeletonSpinner size="sm" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            {uploadLabel}
          </>
        )}
      </button>
    </div>
  );
}
