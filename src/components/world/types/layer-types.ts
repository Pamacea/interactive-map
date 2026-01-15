export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  zIndex: number;
  locked: boolean;
  isBaseMap?: boolean;
  scale: number;
  offsetX: number;
  offsetY: number;
}
