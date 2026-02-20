"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PUBLIC_NAV_ITEMS = [
  { href: "/", label: "HOME", glyph: "ᛟ" },
  { href: "/explore", label: "EXPLORE", glyph: "ᛏ" },
];

interface StaticNavigationProps {
  homeLink?: boolean;
}

/**
 * Static navigation component for SSR pages
 * Only shows public items, no session checking
 */
export function StaticNavigation({ homeLink = true }: StaticNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-16 sm:w-20 z-40 bg-gradient-to-b from-obsidian to-transparent border-r border-iron flex flex-col items-center justify-between py-8">
      <div className="text-2xl text-accent-gold-dark opacity-50 animate-rune-glow">ᛟ</div>

      <div className="flex flex-col gap-12">
        {PUBLIC_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group relative flex flex-col items-center gap-2 transition-all duration-300
                ${isActive ? "text-accent-gold" : "text-bone-dark hover:text-accent-gold"}
              `}
            >
              <span className="text-2xl sm:text-3xl group-hover:animate-rune-glow">{item.glyph}</span>
              <span className="text-[0.6rem] sm:text-xs font-display tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute left-full ml-4 whitespace-nowrap hidden sm:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="text-2xl text-accent-gold-dark opacity-50 animate-rune-glow" style={{ animationDelay: "2s" }}>ᛟ</div>
    </nav>
  );
}
