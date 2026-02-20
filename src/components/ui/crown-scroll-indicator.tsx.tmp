"use client";

import { useEffect, useState } from "react";

export function CrownScrollIndicator() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const thumbPosition = (scrollPercent / 100) * 80;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollPercent(Math.min(percent, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed right-0 top-0 bottom-0 w-14 sm:w-16 z-40 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        <div className="w-0.5 h-[100px] bg-iron relative">
          <div
            className="w-1.5 h-5 bg-accent-gold absolute -left-0.5 transition-all duration-300 shadow-accent-gold/50"
            style={{ top: `${thumbPosition}px` }}
          />
        </div>
        <span className="font-display text-[0.5rem] tracking-[0.4em] text-bone-dark [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 hidden sm:block">
          SCROLL
        </span>
      </div>
    </nav>
  );
}
