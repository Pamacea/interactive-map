"use client";

import { MapImage } from "../map-image";
import { MapPlaceholder } from "../map-placeholder";

interface MapContentProps {
  mapImage?: string | null;
  imageError: boolean;
  children: (props: { showImage: boolean }) => React.ReactNode;
}

export function MapContent({
  mapImage,
  imageError,
  children,
}: MapContentProps) {
  const showImage = mapImage && !imageError;

  return <>{showImage ? children({ showImage: true }) : <MapPlaceholder showGrid={false} />}</>;
}
