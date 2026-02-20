export type LayerType = "BASE_MAP" | "MARKERS" | "IMAGES" | "REGIONS" | "GROUP" | "CUSTOM";

export interface Layer {
  id: string;
  name: string;
  type?: LayerType;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
  isBaseMap?: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
  minZoom: number;
  maxZoom: number;
}
