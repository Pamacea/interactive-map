"use client";

import { Suspense } from "react";
import { Image } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { ImageGallery } from "@/features/gallery/ui/image-gallery";
import { usePanelState } from "@/features/world-editor/store/use-floating-panels-store";

interface GalleryModuleProps {
  worldId: string;
}

/**
 * GalleryModule - Floating panel for world images
 *
 * Features:
 * - Lazy loading (only renders when visible)
 * - Suspense boundary for code splitting
 */
export function GalleryModule({ worldId }: GalleryModuleProps) {
  const { isVisible } = usePanelState("gallery");

  return (
    <FloatingPanel
      panelId="gallery"
      title="Gallery"
      icon={<Image className="w-4 h-4" aria-hidden="true" alt="" />}
    >
      {isVisible && (
        <Suspense fallback={<GallerySkeleton />}>
          <ImageGallery worldId={worldId} />
        </Suspense>
      )}
    </FloatingPanel>
  );
}

function GallerySkeleton() {
  return (
    <div className="p-3 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square bg-slate-800/50 rounded-sm animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
