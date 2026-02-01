"use client";

import { X } from "lucide-react";

interface FileUploadErrorProps {
  error: string;
}

export function FileUploadError({ error }: FileUploadErrorProps) {
  return (
    <div className="flex items-start gap-2 p-3 bg-rose-950/30 border border-rose-900/50 rounded-sm">
      <X className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-rose-300">{error}</p>
    </div>
  );
}
