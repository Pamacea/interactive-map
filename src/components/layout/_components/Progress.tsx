"use client";

import { useProgress } from "@/store/progress.store";
import { Progress as ProgressBar } from "../../ui/progress";

export function Progress() {
  const progressValue = useProgress((state) => state.progress);

  return (
    <ProgressBar
      className="w-full h-0.5 text-chart-3"
      value={progressValue}
      max={100}
    />
  );
}
