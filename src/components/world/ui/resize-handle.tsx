import { GripVertical } from "lucide-react";

interface ResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function ResizeHandle({ onResizeStart, isResizing }: ResizeHandleProps) {
  return (
    <div
      onMouseDown={onResizeStart}
      className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-accent-gold/50 transition-colors group ${
        isResizing ? "bg-accent-gold" : ""
      }`}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-accent-gold" />
      </div>
    </div>
  );
}
