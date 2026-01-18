"use client";

import { SessionProvider } from "@/components/providers/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error("[Layout] Root error boundary caught:", error);
        console.error("[Layout] Component stack:", errorInfo.componentStack);
      }}
    >
      <SessionProvider>
        <QueryProvider>
          <ToastProvider>
            <main id="main-content" className="w-full h-full min-h-screen">
                {children}
            </main>
          </ToastProvider>
        </QueryProvider>
      </SessionProvider>
    </ErrorBoundary>
  )
}
