import { GripVertical } from "lucide-react";

interface ResizeHandleProps {
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
}

export function ResizeHandle({ onResizeStart, isResizing }: ResizeHandleProps) {
  return (
    <>
      <div
        onMouseDown={onResizeStart}
        className={`absolute right-0 top-0 bottom-0 w-8 -mr-4 cursor-col-resize z-10 group transition-all duration-200 ${
          isResizing ? "bg-accent-gold/10" : ""
        }`}
        style={{ touchAction: "none" }}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 w-1 transition-all duration-200 ${
            isResizing
              ? "bg-accent-gold shadow-lg"
              : "bg-transparent group-hover:bg-accent-gold/50"
          }`}
        />

        <div
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 transition-all duration-200 ${
            isResizing ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100 group-hover:scale-100"
          }`}
        >
          <div
            className={`p-1.5 rounded-sm transition-all duration-200 ${
              isResizing
                ? "bg-accent-gold/20 shadow-lg"
                : "bg-transparent group-hover:bg-background-elevated/80"
          }`}
          >
            <GripVertical
              className={`w-4 h-4 transition-colors duration-200 ${
                isResizing ? "text-accent-gold" : "text-text-muted group-hover:text-accent-gold"
              }`}
            />
          </div>
        </div>
      </div>

      {isResizing && (
        <div className="fixed inset-0 bg-black/5 pointer-events-none z-40 select-none" />
      )}
    </>
  );
}
