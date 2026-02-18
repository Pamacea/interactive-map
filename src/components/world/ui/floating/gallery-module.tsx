"use client";

import { Image } from "lucide-react";
import { FloatingPanel } from "./floating-panel";
import { ImageGallery } from "@/components/gallery/ui/image-gallery";

interface GalleryModuleProps {
  worldId: string;
}

export function GalleryModule({ worldId }: GalleryModuleProps) {
  return (
    <FloatingPanel
      panelId="gallery"
      title="Gallery"
      icon={<Image className="w-4 h-4" />}
    >
      <ImageGallery worldId={worldId} />
    </FloatingPanel>
  );
}
