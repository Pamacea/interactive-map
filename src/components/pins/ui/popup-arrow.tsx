/**
 * Popup arrow component
 * Decorative arrow pointing to the pin location
 */

import * as React from "react";

export function PopupArrow() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
      <div
        className="h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[var(--color-accent-gold)]"
        style={{
          borderLeftWidth: "8px",
          borderRightWidth: "8px",
          borderTopWidth: "8px",
        }}
      />
    </div>
  );
}
