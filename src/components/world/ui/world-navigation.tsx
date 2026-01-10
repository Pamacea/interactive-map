"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorldNavigation() {
  const pathname = usePathname();

  return (
    <nav className="h-12 bg-background-base/95 backdrop-blur-sm border-b border-b-accent-gold-dark flex items-center justify-between px-6">
      <Link
        href="/explore"
        className="flex items-center gap-2 text-text-secondary hover:text-accent-gold transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-display font-medium">Back</span>
      </Link>

      <div className="flex items-center gap-8">
        <Link
          href="/worlds"
          className={cn(
            "text-sm font-display font-medium transition-colors relative py-2",
            pathname === "/worlds"
              ? "text-accent-gold"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          My Worlds
          {pathname === "/worlds" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold shadow-glow-medium" />
          )}
        </Link>

        <span className="text-base font-display font-bold text-linear tracking-wider">
          GENESIS
        </span>

        <Link
          href="/explore"
          className={cn(
            "text-sm font-display font-medium transition-colors relative py-2",
            pathname === "/explore"
              ? "text-accent-gold"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          Explore
          {pathname === "/explore" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold shadow-glow-medium" />
          )}
        </Link>
      </div>

      <Link
        href="/profile"
        className="p-2 text-text-secondary hover:text-accent-gold transition-colors"
      >
        <User className="w-4 h-4" />
      </Link>
    </nav>
  );
}
