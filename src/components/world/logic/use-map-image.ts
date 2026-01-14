import { useState, useCallback, useRef, useEffect } from "react";

export interface ImageDimensions {
  width: number;
  height: number;
}

const DEFAULT_MAP_DIMENSIONS: ImageDimensions = {
  width: 1920,
  height: 1080,
};

export function useMapImage(mapImage?: string | null) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions>({
    width: 0,
    height: 0,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleImageLoad = useCallback(() => {
    if (!isMountedRef.current) return;

    setImageLoaded(true);
    setImageError(false);
    if (imageRef.current) {
      const dimensions = {
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      };
      setImageDimensions(dimensions);
    }
  }, []);

  const handleImageError = useCallback(() => {
    if (!isMountedRef.current) return;

    setImageError(true);
    setImageLoaded(false);
  }, []);

  // Reset states when mapImage changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [mapImage]);

  const shouldShowGrid = !mapImage || imageError || !imageLoaded;
  const dimensions = {
    width: imageDimensions.width || DEFAULT_MAP_DIMENSIONS.width,
    height: imageDimensions.height || DEFAULT_MAP_DIMENSIONS.height,
  };

  return {
    imageRef,
    imageError,
    imageLoaded,
    imageDimensions: dimensions,
    shouldShowGrid,
    handleImageLoad,
    handleImageError,
  };
}
