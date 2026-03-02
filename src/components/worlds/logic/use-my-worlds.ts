"use client";

import { useState, useEffect } from "react";
import type { GameWorld } from "@/types/world.type";
import { getMyWorlds } from "@/actions/worlds";

export function useMyWorlds() {
  const [worlds, setWorlds] = useState<GameWorld[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorlds() {
      try {
        setLoading(true);
        setError(null);
        const _data = await getMyWorlds();
        setWorlds(_data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch worlds");
        setWorlds([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWorlds();
  }, []);

  return { worlds, loading, error };
}
