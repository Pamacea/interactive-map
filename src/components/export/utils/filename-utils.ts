/**
 * Filename generation utility for exports
 */

import type { ExportFormat } from "@/actions/export";

/**
 * Generate filename for export
 * @param worldTitle - World title
 * @param format - Export format
 * @returns Generated filename
 */
export function generateExportFilename(worldTitle: string, format: ExportFormat): string {
  // Sanitize title: replace spaces and special chars with hyphens
  const sanitized = worldTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const timestamp = new Date().toISOString().split("T")[0];
  const extension = format === "json" ? "json" : format;

  return `${sanitized}-${timestamp}.${extension}`;
}
