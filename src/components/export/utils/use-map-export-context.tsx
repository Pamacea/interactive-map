"use client";

import { createContext, useContext, useRef, ReactNode } from "react";

interface MapExportContextValue {
  mapElement: HTMLElement | null;
  setMapElement: (element: HTMLElement | null) => void;
}

const MapExportContext = createContext<MapExportContextValue | undefined>(
  undefined
);

export function MapExportProvider({ children }: { children: ReactNode }) {
  const mapElementRef = useRef<HTMLElement | null>(null);

  const setMapElement = (element: HTMLElement | null) => {
    mapElementRef.current = element;
  };

  return (
    <MapExportContext.Provider
      value={{
        mapElement: mapElementRef.current,
        setMapElement,
      }}
    >
      {children}
    </MapExportContext.Provider>
  );
}

export function useMapExport() {
  const context = useContext(MapExportContext);
  if (!context) {
    throw new Error("useMapExport must be used within MapExportProvider");
  }
  return context;
}
