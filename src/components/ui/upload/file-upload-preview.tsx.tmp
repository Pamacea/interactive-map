"use client";

import Image from "next/image";

interface FileUploadPreviewProps {
  previewUrl: string;
  fileName: string;
  fileSize: number;
  fileSizeUnit: "MB" | "KB";
  onRemove: (e: React.MouseEvent) => void;
  disabled?: boolean;
  previewClassName?: string;
}

export function FileUploadPreview({
  previewUrl,
  fileName,
  fileSize,
  fileSizeUnit,
  onRemove,
  disabled = false,
  previewClassName = "aspect-video w-full",
}: FileUploadPreviewProps) {
  const formatSize = () => {
    return fileSizeUnit === "MB"
      ? (fileSize / 1024 / 1024).toFixed(2)
      : (fileSize / 1024).toFixed(1);
  };

  return (
    <div className="space-y-3">
      <div className={`${previewClassName} overflow-hidden rounded-sm bg-background-base`}>
        <Image
          src={previewUrl}
          alt="Preview"
          width={400}
          height={300}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-sm text-text-muted">
        <p className="font-medium text-text-secondary truncate">{fileName}</p>
        <p className="text-xs">
          {formatSize()} {fileSizeUnit}
        </p>
      </div>
      <button
        onClick={onRemove}
        disabled={disabled}
        className="text-sm text-accent-gold hover:text-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Choose different file
      </button>
    </div>
  );
}
