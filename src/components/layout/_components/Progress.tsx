"use client";

import { useEffect, useState } from "react";
import { Progress as ProgressBar } from "../../ui/progress";
import { useSection } from "@/store/section.store";

export function Progress() {
  // Get current section
  const section = useSection((state) => state.section);
  // State for progress
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    // Progress values
    let minProgress = 0;
    let maxProgress = 100;

    // Set min and max progress based on section
    switch (section) {
      case "hero":
        minProgress = 0;
        maxProgress = 25;
        break;
      case "game":
        minProgress = 25;
        maxProgress = 50;
        break;
      case "features":
        minProgress = 50;
        maxProgress = 75;
        break;
      case "about":
        minProgress = 75;
        maxProgress = 100;
        break;
    }

    // Set initial progress(depends on section)
    setProgressValue(minProgress);

    // Update progressValue when scrolling
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollPosition / totalHeight) * 100;
      const finalProgress = Math.min(
        maxProgress,
        Math.max(minProgress, scrollProgress)
      );

      setProgressValue(Math.min(100, finalProgress));
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [section]);

  return (
    <ProgressBar
      className="w-full h-0.5 text-chart-3"
      value={progressValue}
      max={100}
    />
  );
}
