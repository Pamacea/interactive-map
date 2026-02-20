import { useState } from "react";

export function useWorldSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return {
    sidebarOpen,
    toggleSidebar,
  };
}
