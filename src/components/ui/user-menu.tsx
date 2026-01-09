"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const user = session?.user;

  if (!user) {
    return (
      <Link href="/auth/signin">
        <button className="px-4 py-2 rounded-lg bg-accent-gold text-background-base font-medium hover:bg-accent-gold-dark transition-all duration-200">
          Sign In
        </button>
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md",
          "transition-all duration-200",
          "hover:bg-background-card-hover",
          isOpen && "bg-background-card shadow-glow-subtle"
        )}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-sm font-bold text-background-base">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
          )}
        </div>

        {/* Name - hidden on small screens */}
        <span className="hidden sm:block text-sm font-medium text-text-primary">
          {user.name || "User"}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-accent-gold"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-56",
            "bg-background-card",
            "rounded-lg border border-border-ornate shadow-xl",
            "overflow-hidden",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border-subtle">
            <p className="text-sm font-display font-semibold text-text-primary">
              {user.name || "User"}
            </p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-card-hover transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </Link>

            <Link
              href="/worlds"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-card-hover transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>My Worlds</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-background-card-hover transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Divider */}
          <div className="border-t border-border-subtle" />

          {/* Sign Out */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-status-error hover:text-status-error hover:bg-background-card-hover transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
