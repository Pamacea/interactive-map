"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LogOut, Sparkles, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingAuthBar() {
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
    <div className="fixed bottom-6 right-6 z-50">
      <div ref={menuRef} className="relative">
        {!user ? (
          <Link href="/auth/signin">
            <button className="group relative flex items-center gap-2 px-5 py-2.5 bg-obsidian/80 backdrop-blur-md border border-accent-gold/50 text-accent-gold font-display tracking-wider text-sm hover:bg-accent-gold hover:text-void transition-all duration-300 shadow-lg shadow-accent-gold/20 hover:shadow-xl hover:shadow-accent-gold/40">
              <Crown className="w-4 h-4" />
              <span className="font-display-ornate">ENTER THE REALM</span>
              <span className="absolute inset-0 border border-accent-gold/30 scale-105 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300" />
            </button>
          </Link>
        ) : (
          <>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5",
                "bg-obsidian/80 backdrop-blur-md",
                "border border-accent-gold/50",
                "transition-all duration-300",
                "hover:bg-accent-gold hover:text-void hover:shadow-xl hover:shadow-accent-gold/40",
                isOpen && "bg-accent-gold text-void shadow-xl shadow-accent-gold/40"
              )}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-sm font-bold text-void">
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
              <span className="hidden sm:block font-display-ornate text-sm tracking-wider">
                {user.name || "TRAVELER"}
              </span>
            </button>

            {isOpen && (
              <div className="absolute bottom-full right-0 mb-2 w-56 bg-obsidian/95 backdrop-blur-md rounded-sm border border-accent-gold/50 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="px-4 py-3 border-b border-accent-gold/20">
                  <p className="text-sm font-display-ornate font-semibold text-accent-gold">
                    {user.name || "Traveler"}
                  </p>
                  <p className="text-xs text-bone-dark truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-bone hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="font-display">Profile</span>
                  </Link>

                  <Link
                    href="/worlds"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-bone hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="font-display">My Worlds</span>
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-bone hover:text-accent-gold hover:bg-accent-gold/10 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
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
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-blood-bright hover:text-blood hover:bg-blood/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-display">Depart</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
