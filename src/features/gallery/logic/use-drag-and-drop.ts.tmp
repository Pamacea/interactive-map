import { useCallback, useState } from "react";

interface UseDragAndDropOptions {
  onDrop: (e: React.DragEvent) => void | Promise<void>;
}

interface UseDragAndDropReturn {
  isDragging: boolean;
  dragHandlers: {
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void | Promise<void>;
  };
}

/**
 * Custom hook for handling drag-and-drop functionality
 * Manages drag state and provides event handlers for drag operations
 */
export function useDragAndDrop({
  onDrop,
}: UseDragAndDropOptions): UseDragAndDropReturn {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDropWrapper = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      await onDrop(e);
    },
    [onDrop]
  );

  return {
    isDragging,
    dragHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDropWrapper,
    },
  };
}
