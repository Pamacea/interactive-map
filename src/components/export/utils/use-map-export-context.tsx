"use client";

import { createContext, useContext, useRef, ReactNode, useCallback } from "react";

interface MapExportContextValue {
  getMapElement: () => HTMLElement | null;
  setMapElement: (element: HTMLElement | null) => void;
}

const MapExportContext = createContext<MapExportContextValue | undefined>(
  undefined
);

export function MapExportProvider({ children }: { children: ReactNode }) {
  const mapElementRef = useRef<HTMLElement | null>(null);

  const setMapElement = useCallback((element: HTMLElement | null) => {
    mapElementRef.current = element;
  }, []);

  const getMapElement = useCallback(() => {
    return mapElementRef.current;
  }, []);

  return (
    <MapExportContext.Provider
      value={{
        getMapElement,
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
