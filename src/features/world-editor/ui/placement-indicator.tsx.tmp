import { FC } from "react";

export interface PlacementIndicatorProps {
  show: boolean;
}

export const PlacementIndicator: FC<PlacementIndicatorProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-accent-gold/20 border border-accent-gold/50 px-4 py-2 rounded-sm backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-accent-gold"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
        <span className="text-sm font-medium text-accent-gold">
          Right-click to create pin
        </span>
      </div>
    </div>
  );
};
