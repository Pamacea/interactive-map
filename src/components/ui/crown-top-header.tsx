"use client";

import Link from "next/link";
import { AuthButton } from "@/components/home/ui/auth-button";

export function CrownTopHeader() {
  return (
    <header className="fixed top-0 left-16 sm:left-20 right-0 h-16 z-40 flex items-center justify-between border-b border-iron bg-gradient-to-b from-obsidian to-transparent px-4">
      {/* Left - Sword icon */}
      <Link href="/" className="w-12 h-full flex items-center justify-center border-x border-iron hover:bg-accent-gold/10 transition-colors">
        <span className="text-accent-gold-dark text-lg opacity-60">⚔</span>
      </Link>

      {/* Center - Title */}
      <div className="flex items-baseline gap-2 sm:gap-4">
        <span className="font-display text-[0.6rem] tracking-[0.3em] text-bone-dark hidden sm:inline">THE</span>
        <Link href="/" className="font-display-ornate text-sm tracking-[0.2em] text-accent-gold hover:text-accent-gold-light transition-colors">
          GENESIS
        </Link>
        <span className="font-display text-[0.6rem] tracking-[0.3em] text-bone-dark hidden sm:inline">AWAITS</span>
      </div>

      {/* Right - Auth Button */}
      <div className="flex items-center justify-center border-x border-iron px-4">
        <AuthButton />
      </div>
    </header>
  );
}
