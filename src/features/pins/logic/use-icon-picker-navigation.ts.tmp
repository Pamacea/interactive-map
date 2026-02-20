import { useState } from "react";

interface UseIconPickerNavigationOptions {
  itemsCount: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function useIconPickerNavigation({
  itemsCount,
  onSelect,
  onClose,
}: UseIconPickerNavigationOptions) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % itemsCount);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
        break;
      case "Enter":
        e.preventDefault();
        onSelect(selectedIndex);
        onClose();
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  const resetIndex = () => setSelectedIndex(0);

  return { selectedIndex, setSelectedIndex, handleKeyDown, resetIndex };
}
