/**
 * Popup arrow component
 * Decorative arrow pointing to the pin location
 */

import * as React from "react";

export function PopupArrow() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%-1px)]">
      <div
        className="h-0 w-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-[var(--color-accent-gold)]"
      />
    </div>
  );
}
