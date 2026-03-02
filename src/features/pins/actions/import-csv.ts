"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import type { Pin } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";

interface CSVRow {
  title: string;
  description?: string;
  latitude: string;
  longitude: string;
  icon?: string;
  color?: string;
  type?: string;
}

/**
 * Import pins from CSV content
 *
 * CSV format:
 * title,description,latitude,longitude,icon,color,type
 */
export async function importPinsFromCSV(
  worldId: string,
  csvContent: string,
  layerId?: string
): Promise<Result<{ created: number; pins: Pin[] }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(worldId, user.id);

    // Parse CSV
    const lines = csvContent.trim().split("\n");
    if (lines.length < 2) {
      throw new ValidationError("CSV must contain at least a header and one data row");
    }

    // Parse header
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const titleIdx = headers.indexOf("title");
    const descIdx = headers.indexOf("description");
    const latIdx = headers.indexOf("latitude");
    const lonIdx = headers.indexOf("longitude");
    const iconIdx = headers.indexOf("icon");
    const colorIdx = headers.indexOf("color");
    const typeIdx = headers.indexOf("type");

    if (titleIdx === -1 || latIdx === -1 || lonIdx === -1) {
      throw new ValidationError("CSV must contain 'title', 'latitude', and 'longitude' columns");
    }

    const pins: Pin[] = [];
    let created = 0;

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);

      if (values.length < headers.length) continue;

      const title = values[titleIdx]?.trim() || `Pin ${i}`;
      const description = descIdx >= 0 ? values[descIdx]?.trim() || null : null;
      const latitude = parseFloat(values[latIdx]);
      const longitude = parseFloat(values[lonIdx]);
      const icon = iconIdx >= 0 ? values[iconIdx]?.trim() || null : null;
      const color = colorIdx >= 0 ? values[colorIdx]?.trim() || undefined : undefined;
      const type = typeIdx >= 0 ? values[typeIdx]?.trim() || undefined : undefined;

      if (isNaN(latitude) || isNaN(longitude)) {
        continue; // Skip invalid rows
      }

      const pin = await prisma.pin.create({
        data: {
          title,
          description,
          latitude,
          longitude,
          icon,
          color,
          pinType: type || "CUSTOM",
          size: 32,
          isVisible: true,
          userId: user.id,
          gameWorldId: worldId,
          layerId: layerId || null,
        },
      });

      pins.push(pin);
      created++;
    }

    revalidatePath(`/world/${worldId}`);

    return { created, pins };
  }, "importPinsFromCSV");
}

/**
 * Parse a CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      // Field separator
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
