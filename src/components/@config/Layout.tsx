"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <main className="w-full h-full min-h-screen">
            {children}
        </main>
      </QueryProvider>
    </SessionProvider>
  )
}
