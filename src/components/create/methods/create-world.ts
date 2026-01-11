"use client";

import { createWorld as createWorldAction } from "@/actions/worlds";

export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
}) {
  const result = await createWorldAction(data);
  return result;
}
