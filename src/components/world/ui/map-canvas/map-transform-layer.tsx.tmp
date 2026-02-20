"use client";

import { type ReactNode } from "react";

interface MapTransformLayerProps {
  translateX: number;
  translateY: number;
  scale: number;
  isDragging: boolean;
  children: ReactNode;
}

export function MapTransformLayer({
  translateX,
  translateY,
  scale,
  isDragging,
  children,
}: MapTransformLayerProps) {
  return (
    <div
      className="absolute top-0 left-0 flex items-center justify-center"
      style={{
        width: "100%",
        height: "100%",
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        transformOrigin: "center center",
        transition: isDragging ? "none" : "transform 0.1s ease-out",
      }}
    >
      {children}
    </div>
  );
}
