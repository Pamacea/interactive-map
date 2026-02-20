/**
 * Export utility functions for client-side export operations
 *
 * Based on official documentation:
 * - html2canvas: https://github.com/niklasvh/html2canvas
 * - jsPDF: https://github.com/parallax/jsPDF
 *
 * PERFORMANCE: Heavy libraries (html2canvas, jsPDF) are lazy-loaded
 * only when export is actually triggered, reducing initial bundle size.
 */

import type { ExportFormat, WorldExportData } from "@/actions/export";

// Dynamic imports for heavy libraries - only loaded when needed
let html2canvasModule: typeof import("html2canvas") | null = null;
let jsPDFModule: typeof import("jspdf") | null = null;

async function getHtml2Canvas() {
  if (!html2canvasModule) {
    html2canvasModule = await import("html2canvas");
  }
  return html2canvasModule.default;
}

async function getJsPDF() {
  if (!jsPDFModule) {
    jsPDFModule = await import("jspdf");
  }
  return jsPDFModule.jsPDF;
}

/**
 * Export element as PNG image
 * @param element - DOM element to capture
 * @param filename - Output filename
 * @returns Promise that resolves when export is complete
 */
export async function exportAsPNG(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    // Lazy load html2canvas only when needed
    const html2canvas = await getHtml2Canvas();

    // Capture element as canvas using html2canvas
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true, // Allow cross-origin images
      allowTaint: true,
    });

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to generate image");
      }

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error("[exportAsPNG] Failed to export as PNG:", error);
    throw new Error("Failed to export map as PNG. Please try again.");
  }
}

/**
 * Export element as PDF document
 * @param element - DOM element to capture
 * @param filename - Output filename
 * @returns Promise that resolves when export is complete
 */
export async function exportAsPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  try {
    // Lazy load both libraries only when needed
    const html2canvas = await getHtml2Canvas();
    const jsPDF = await getJsPDF();

    // Capture element as canvas
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    });

    // Get canvas dimensions
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate PDF dimensions (A4 size: 210mm x 297mm)
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Calculate ratio to fit image on PDF page
    const ratio = Math.min(
      pdfWidth / (imgWidth * 0.264583), // Convert pixels to mm
      pdfHeight / (imgHeight * 0.264583)
    );

    const imgWidthMM = imgWidth * 0.264583 * ratio;
    const imgHeightMM = imgHeight * 0.264583 * ratio;

    // Create PDF document
    const pdf = new jsPDF({
      orientation: imgWidthMM > imgHeightMM ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    // Add image to PDF
    const x = (pdfWidth - imgWidthMM) / 2;
    const y = (pdfHeight - imgHeightMM) / 2;

    pdf.addImage(imgData, "PNG", x, y, imgWidthMM, imgHeightMM);
    pdf.save(filename);
  } catch (error) {
    console.error("[exportAsPDF] Failed to export as PDF:", error);
    throw new Error("Failed to export map as PDF. Please try again.");
  }
}

/**
 * Export world data as JSON
 * @param data - World export data
 * @param filename - Output filename
 * @returns Promise that resolves when export is complete
 */
export async function exportAsJSON(
  data: WorldExportData,
  filename: string
): Promise<void> {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("[exportAsJSON] Failed to export as JSON:", error);
    throw new Error("Failed to export world data as JSON. Please try again.");
  }
}

/**
 * Export map based on format
 * @param element - DOM element to capture (for PNG/PDF)
 * @param data - World export data (for JSON)
 * @param format - Export format
 * @param filename - Output filename
 * @returns Promise that resolves when export is complete
 */
export async function exportMap(
  element: HTMLElement | null,
  data: WorldExportData,
  format: ExportFormat,
  filename: string
): Promise<void> {
  switch (format) {
    case "png":
      if (!element) {
        throw new Error("Map element is required for PNG export");
      }
      return exportAsPNG(element, filename);

    case "pdf":
      if (!element) {
        throw new Error("Map element is required for PDF export");
      }
      return exportAsPDF(element, filename);

    case "json":
      return exportAsJSON(data, filename);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Estimate file size for export format
 * @param format - Export format
 * @param element - DOM element (for PNG/PDF)
 * @returns Estimated size in bytes
 */
export function estimateFileSize(
  format: ExportFormat,
  element?: HTMLElement | null
): number {
  if (!element) {
    // JSON estimate based on typical world data
    return format === "json" ? 50000 : 0;
  }

  const rect = element.getBoundingClientRect();
  const pixels = rect.width * rect.height;

  switch (format) {
    case "png":
      // Estimate: ~3 bytes per pixel with compression
      return Math.round(pixels * 3 * 0.3);

    case "pdf":
      // Estimate: ~2 bytes per pixel with compression
      return Math.round(pixels * 2 * 0.2);

    case "json":
      return 50000; // Typical JSON size

    default:
      return 0;
  }
}

/**
 * Format file size for display
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
