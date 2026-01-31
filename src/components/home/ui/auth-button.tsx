"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthButton() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={menuRef} className="relative">
      {!user ? (
        <Link href="/auth/signin">
          <button className="flex items-center gap-2 px-4 py-2 text-accent-gold font-display-ornate text-xs tracking-wider hover:text-accent-gold-light transition-colors">
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">ENTER</span>
          </button>
        </Link>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-2",
              "transition-all duration-200",
              "hover:bg-accent-gold/10",
              isOpen && "bg-accent-gold/10"
            )}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-xs font-bold text-void">
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
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full pt-2 w-48 bg-obsidian/95 backdrop-blur-md rounded-sm border border-accent-gold/50 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-accent-gold/20">
                <p className="text-xs font-display-ornate truncate text-accent-gold">
                  {user.name || "Traveler"}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-bone hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="font-display">Profile</span>
                </Link>

                <Link
                  href="/worlds"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-bone hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-display">My Worlds</span>
                </Link>

                <Link
                  href="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-xs text-bone hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="font-display">Settings</span>
                </Link>
              </div>

              <div className="border-t border-accent-gold/20" />

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-xs text-blood-bright hover:text-blood hover:bg-blood/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="font-display">Depart</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
