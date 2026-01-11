// World Card Types
export interface WorldCardProps {
  id: string;
  title: string;
  description: string | null;
  map: string | null;
  _count?: {
    pins?: number;
    loreEntries?: number;
  };
  user: {
    name: string | null;
    image: string | null;
  };
  isPublic?: boolean;
  viewMode?: "grid" | "list";
  className?: string;
}

export interface WorldCardContentProps {
  title: string;
  description: string | null;
  pinCount: number;
  loreCount: number;
  author: {
    name: string | null;
    image: string | null;
  };
  viewMode?: "grid" | "list";
}

// Filter Types
export interface FilterWorldsParams {
  query: string;
  tags?: string[];
}

// View Mode Types
export type ViewMode = "grid" | "list";

// Create World Types
export interface CreateWorldInput {
  title: string;
  description: string;
  isPublic: boolean;
}

export interface CreateWorldResponse {
  worldId?: string;
  error?: string;
}
