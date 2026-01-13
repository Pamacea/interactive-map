"use client";

import { createWorld as createWorldAction } from "@/actions/worlds";

export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
  map?: File;
}) {
  console.log("📋 createWorld method called with:", {
    title: data.title,
    hasMap: !!data.map,
  });

  const result = await createWorldAction(data);

  console.log("📦 createWorld method received:", {
    result,
    worldId: result?.worldId,
  });

  return result;
}
