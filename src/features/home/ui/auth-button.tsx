"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/shared/utils";

const menuItems = [
  { href: "/worlds", label: "My Worlds", rune: "ᚦ" },
  { href: "/settings", label: "Settings", rune: "ᛗ" },
];

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
            <span className="text-accent-gold-dark opacity-60">ᛟ</span>
            <span className="hidden sm:inline">ENTER</span>
          </button>
        </Link>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 transition-all duration-200 hover:bg-accent-gold/10"
          >
            <div className="w-7 h-7 rounded-sm bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-xs font-display-ornate font-bold text-void border border-accent-gold/30">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-full h-full rounded-sm object-cover"
                />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full pt-2 min-w-[180px]">
              {/* Dropdown Container */}
              <div className="relative bg-obsidian/95 backdrop-blur-md border border-accent-gold/30 shadow-xl overflow-hidden">
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent" />

                {/* User Name Section */}
                <div className="px-4 py-3 border-b border-iron/50 bg-void/30">
                  <div className="flex items-center gap-2">
                    <span className="text-accent-gold-dark opacity-50 text-xs">ᛟ</span>
                    <p className="font-display-ornate text-sm text-accent-gold tracking-wide">
                      {user.name || "Traveler"}
                    </p>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center gap-3 px-4 py-2.5 text-bone-dark hover:text-accent-gold hover:bg-accent-gold/5 transition-all duration-200 relative"
                    >
                      <span className="text-accent-gold/40 group-hover:text-accent-gold text-sm font-display-ornate">
                        {item.rune}
                      </span>
                      <span className="font-display text-xs tracking-wider">{item.label}</span>
                      {/* Hover effect indicator */}
                      <span className="absolute right-2 w-1 h-1 bg-accent-gold/0 group-hover:bg-accent-gold/50 rounded-sm transition-all duration-200" />
                    </Link>
                  ))}
                </div>

                {/* Divider with decorative element */}
                <div className="flex items-center gap-2 px-4 py-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-accent-gold/20" />
                  <span className="text-accent-gold-dark/30 text-xs">ᛞ</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-accent-gold/20" />
                </div>

                {/* Sign Out */}
                <div className="px-2 pb-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="group flex items-center gap-3 w-full px-3 py-2.5 text-bone-dark hover:text-blood hover:bg-blood/5 transition-all duration-200 relative rounded-sm"
                  >
                    <span className="text-blood/50 group-hover:text-blood text-sm font-display-ornate">ᛚ</span>
                    <span className="font-display text-xs tracking-wider">DEPART</span>
                    <span className="absolute right-3 w-1 h-1 bg-blood/0 group-hover:bg-blood/50 rounded-sm transition-all duration-200" />
                  </button>
                </div>

                {/* Decorative bottom border */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
