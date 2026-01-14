import type { FC } from "react";

export interface MapPlaceholderProps {
  showGrid: boolean;
}

export const MapPlaceholder: FC<MapPlaceholderProps> = ({ showGrid }) => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
    >
      {showGrid && (
        <defs>
          <pattern
            id="grid-placeholder"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
      )}
      {showGrid && <rect width="100%" height="100%" fill="url(#grid-placeholder)" />}
      <circle
        cx="960"
        cy="540"
        r="100"
        fill="none"
        stroke="rgba(212, 175, 55, 0.3)"
        strokeWidth="2"
      />
      <circle
        cx="960"
        cy="540"
        r="200"
        fill="none"
        stroke="rgba(212, 175, 55, 0.2)"
        strokeWidth="1"
      />
      <circle
        cx="960"
        cy="540"
        r="300"
        fill="none"
        stroke="rgba(212, 175, 55, 0.1)"
        strokeWidth="1"
      />
    </svg>
  );
};
