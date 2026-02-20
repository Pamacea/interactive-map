"use client";

import { createWorld as createWorldAction } from "@/features/worlds";

export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
  map?: File;
}) {
  const result = await createWorldAction(data);

  // Extract the worldId from the Result type
  if (!result.success) {
    throw new Error(result.error.message || "Failed to create world");
  }

  return result.data; // Return { worldId: string }
}
