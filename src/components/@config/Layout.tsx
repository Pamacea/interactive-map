"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ToastProvider>
          <main className="w-full h-full min-h-screen">
              {children}
          </main>
        </ToastProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
