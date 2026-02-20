"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const PUBLIC_NAV_ITEMS = [
  { href: "/", label: "HOME", glyph: "ᛟ" },
  { href: "/explore", label: "EXPLORE", glyph: "ᛏ" },
];

const PROTECTED_NAV_ITEMS = [
  { href: "/worlds", label: "MY WORLDS", glyph: "ᚦ" },
  { href: "/create", label: "CREATE", glyph: "ᚨ" },
  { href: "/settings", label: "SETTINGS", glyph: "ᛗ" },
];

interface CrownNavigationProps {
  homeLink?: boolean;
}

export function CrownNavigation({ homeLink = true }: CrownNavigationProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAuthenticated = !!session;

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
              className={`w-10 h-10 flex items-center justify-center font-display-ornate text-base border relative transition-all duration-400 group ${
                isActive
                  ? "text-accent-gold border-accent-gold bg-accent-gold/10"
                  : "text-bone-dark border-iron hover:text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10"
              }`}
            >
              {item.glyph}
              <span className="absolute left-16 font-display text-[0.6rem] tracking-[0.3em] text-bone-dark opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap hidden sm:inline-block">
                {item.label}
              </span>
            </Link>
          );
        })}

        {PROTECTED_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href + "/"));
          const isDisabled = !isAuthenticated;

          if (isDisabled) {
            return (
              <div
                key={item.href}
                className="w-10 h-10 flex items-center justify-center font-display-ornate text-base border relative text-bone-dark/20 border-iron/30 cursor-not-allowed opacity-40"
                title="Sign in to access"
              >
                {item.glyph}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`w-10 h-10 flex items-center justify-center font-display-ornate text-base border relative transition-all duration-400 group ${
                isActive
                  ? "text-accent-gold border-accent-gold bg-accent-gold/10"
                  : "text-bone-dark border-iron hover:text-accent-gold hover:border-accent-gold hover:bg-accent-gold/10"
              }`}
            >
              {item.glyph}
              <span className="absolute left-16 font-display text-[0.6rem] tracking-[0.3em] text-bone-dark opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap hidden sm:inline-block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="text-2xl text-accent-gold-dark opacity-50 animate-rune-glow">ᛞ</div>
    </nav>
  );
}
