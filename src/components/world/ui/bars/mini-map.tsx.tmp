/**
 * Mini-map - Small overview map showing current viewport
 *
 * Features:
 * - 120x120px positioned bottom-left (above bottom bar)
 * - Shows reduced view of the world
 * - Rectangle represents current viewport
 * - Draggable to navigate
 * - Click to recenter
 * - Synchronized with main map viewport
 */

import { useRef, useEffect, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import type { ViewportTransform } from "../../logic/use-viewport";

export interface MiniMapProps {
  mapImage?: string | null;
  transform: ViewportTransform;
  onTransformChange: (transform: ViewportTransform) => void;
  className?: string;
}

const MINIMAP_SIZE = 120;
const MINIMAP_MARGIN = 8; // Space from bottom-left corner
const BOTTOM_BAR_HEIGHT = 48;

export function MiniMap({
  mapImage,
  transform,
  onTransformChange,
  className,
}: MiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [viewportRect, setViewportRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Load image to get dimensions
  useEffect(() => {
    if (!mapImage) return;

    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = mapImage;
  }, [mapImage]);

  // Calculate viewport rectangle in mini-map coordinates
  useEffect(() => {
    if (!imageSize || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Mini-map scale (how much the image is scaled down)
    const mapAspectRatio = imageSize.width / imageSize.height;
    let miniMapWidth: number;
    let miniMapHeight: number;

    if (mapAspectRatio > 1) {
      miniMapWidth = MINIMAP_SIZE;
      miniMapHeight = MINIMAP_SIZE / mapAspectRatio;
    } else {
      miniMapHeight = MINIMAP_SIZE;
      miniMapWidth = MINIMAP_SIZE * mapAspectRatio;
    }

    const miniMapScale = miniMapWidth / imageSize.width;

    // Calculate viewport in world coordinates
    // The viewport shows a portion of the map based on transform
    const viewportWidth = containerRect.width / transform.scale;
    const viewportHeight = containerRect.height / transform.scale;
    const viewportX = -transform.translateX / transform.scale;
    const viewportY = -transform.translateY / transform.scale;

    // Convert to mini-map coordinates
    const rectX = viewportX * miniMapScale;
    const rectY = viewportY * miniMapScale;
    const rectWidth = viewportWidth * miniMapScale;
    const rectHeight = viewportHeight * miniMapScale;

    setViewportRect({ x: rectX, y: rectY, width: rectWidth, height: rectHeight });
  }, [transform, imageSize]);

  // Handle mini-map click to recenter
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current || !imageSize) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Mini-map dimensions
      const mapAspectRatio = imageSize.width / imageSize.height;
      let miniMapWidth: number;
      let miniMapHeight: number;

      if (mapAspectRatio > 1) {
        miniMapWidth = MINIMAP_SIZE;
        miniMapHeight = MINIMAP_SIZE / mapAspectRatio;
      } else {
        miniMapHeight = MINIMAP_SIZE;
        miniMapWidth = MINIMAP_SIZE * mapAspectRatio;
      }

      const miniMapScale = miniMapWidth / imageSize.width;

      // Convert click to world coordinates (center of viewport)
      const worldX = clickX / miniMapScale;
      const worldY = clickY / miniMapScale;

      // Calculate new translate to center this point
      const mainContainer = document.querySelector("[data-map-container]") as HTMLElement;
      if (!mainContainer) return;

      const mainRect = mainContainer.getBoundingClientRect();
      const newTranslateX = -(worldX * transform.scale) + mainRect.width / 2;
      const newTranslateY = -(worldY * transform.scale) + mainRect.height / 2;

      onTransformChange({
        ...transform,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    },
    [imageSize, transform, onTransformChange]
  );

  // Handle mini-map drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      e.preventDefault();
    },
    []
  );

  useEffect(() => {
    if (!isDragging || !containerRef.current || !imageSize) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Mini-map dimensions
      const mapAspectRatio = imageSize.width / imageSize.height;
      let miniMapWidth: number;
      let miniMapHeight: number;

      if (mapAspectRatio > 1) {
        miniMapWidth = MINIMAP_SIZE;
        miniMapHeight = MINIMAP_SIZE / mapAspectRatio;
      } else {
        miniMapHeight = MINIMAP_SIZE;
        miniMapWidth = MINIMAP_SIZE * mapAspectRatio;
      }

      const miniMapScale = miniMapWidth / imageSize.width;

      // Convert to world coordinates
      const worldX = x / miniMapScale;
      const worldY = y / miniMapScale;

      // Calculate new translate
      const mainContainer = document.querySelector("[data-map-container]") as HTMLElement;
      if (!mainContainer) return;

      const mainRect = mainContainer.getBoundingClientRect();
      const newTranslateX = -(worldX * transform.scale) + mainRect.width / 2;
      const newTranslateY = -(worldY * transform.scale) + mainRect.height / 2;

      onTransformChange({
        ...transform,
        translateX: newTranslateX,
        translateY: newTranslateY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, imageSize, transform, onTransformChange]);

  if (!mapImage) {
    return null;
  }

  const mapAspectRatio = imageSize ? imageSize.width / imageSize.height : 1;
  let miniMapWidth: number;
  let miniMapHeight: number;

  if (mapAspectRatio > 1) {
    miniMapWidth = MINIMAP_SIZE;
    miniMapHeight = MINIMAP_SIZE / mapAspectRatio;
  } else {
    miniMapHeight = MINIMAP_SIZE;
    miniMapWidth = MINIMAP_SIZE * mapAspectRatio;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-35 bg-obsidian/95 backdrop-blur-md rounded-sm border-2 border-iron/80 shadow-xl overflow-hidden cursor-pointer hover:border-accent-gold/50 transition-colors",
        className
      )}
      style={{
        bottom: BOTTOM_BAR_HEIGHT + MINIMAP_MARGIN,
        left: MINIMAP_MARGIN,
        width: MINIMAP_SIZE,
        height: MINIMAP_SIZE,
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      role="button"
      aria-label="Mini-map - click to recenter, drag to navigate"
      tabIndex={0}
    >
      {/* Map image thumbnail */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${mapImage})`,
          width: miniMapWidth,
          height: miniMapHeight,
          left: (MINIMAP_SIZE - miniMapWidth) / 2,
          top: (MINIMAP_SIZE - miniMapHeight) / 2,
        }}
      />

      {/* Viewport rectangle */}
      <div
        className="absolute border-2 border-accent-gold bg-accent-gold/20 pointer-events-none"
        style={{
          left: viewportRect.x + (MINIMAP_SIZE - miniMapWidth) / 2,
          top: viewportRect.y + (MINIMAP_SIZE - miniMapHeight) / 2,
          width: Math.max(viewportRect.width, 4),
          height: Math.max(viewportRect.height, 4),
        }}
      />
    </div>
  );
}
