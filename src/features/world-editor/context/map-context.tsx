"use client";

import { createContext, useContext, ReactNode } from "react";

export interface MapCenterContextValue {
  /**
   * Center the map on a specific pin position
   * @param pinId - The ID of the pin to center on
   */
  centerOnPin: (pinId: string) => void;
}

const MapCenterContext = createContext<MapCenterContextValue | null>(null);

export interface MapCenterProviderProps {
  children: ReactNode;
  centerOnPin: (pinId: string) => void;
}

export function MapCenterProvider({ children, centerOnPin }: MapCenterProviderProps) {
  return (
    <MapCenterContext.Provider value={{ centerOnPin }}>
      {children}
    </MapCenterContext.Provider>
  );
}

/**
 * Hook to access the map centering function
 * Throws an error if used outside of MapCenterProvider
 */
export function useMapCenter(): MapCenterContextValue {
  const context = useContext(MapCenterContext);
  if (!context) {
    throw new Error("useMapCenter must be used within a MapCenterProvider");
  }
  return context;
}
