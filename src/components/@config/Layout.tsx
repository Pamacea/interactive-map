"use client";

import { SessionProvider } from "@/components/providers/session-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <main className="w-full h-full min-h-screen">
          {children}
      </main>
    </SessionProvider>
  )
}
