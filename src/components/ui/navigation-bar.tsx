"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { UserMenu } from "./user-menu";

const navLinks = [
  { href: "/create", label: "Create World" },
  { href: "/explore", label: "Explore" },
  { href: "/library", label: "Library" },
  { href: "/tutorials", label: "Tutorials" },
];

export function NavigationBar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background-base/95 backdrop-blur-sm border-b border-b-accent-gold-dark">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-linear tracking-wider">
                GENESIS
              </span>
              <span className="text-xxs text-text-muted uppercase tracking-widest">
                Atlas Builder
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-display font-medium tracking-wide transition-colors relative py-2",
                  pathname === link.href
                    ? "text-accent-gold"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-gold shadow-glow-medium" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Link
              href="/explore"
              className="hidden sm:flex p-2 text-text-secondary hover:text-accent-gold transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-accent-gold transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-background-elevated">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-sm text-sm font-display font-medium transition-colors",
                  pathname === link.href
                    ? "bg-accent-gold/10 text-accent-gold"
                    : "text-text-secondary hover:text-text-primary hover:bg-background-card"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
