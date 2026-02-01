"use client";

import { ImageIcon } from "lucide-react";

interface FileUploadInfoProps {
  message: string;
}

export function FileUploadInfo({ message }: FileUploadInfoProps) {
  return (
    <div className="flex items-start gap-2 p-3 bg-blue-950/30 border border-blue-900/50 rounded-sm">
      <ImageIcon className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-blue-300">{message}</p>
    </div>
  );
}
