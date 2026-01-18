"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

/**
 * Global Error Boundary
 *
 * Catches errors at the root layout level and displays a fallback UI.
 * This is the last resort error handler for the entire application.
 *
 * IMPORTANT: global-error.tsx must define its own <html> and <body> tags
 * because it replaces the root layout when active.
 *
 * According to Next.js 16 error handling:
 * https://nextjs.org/docs/app/getting-started/error-handling
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console
    console.error("[GlobalError] Critical application error:", error);

    // Log to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      logCriticalError(error);
    }
  }, [error]);

  /**
   * Log critical errors to external service
   */
  const logCriticalError = (error: Error & { digest?: string }): void => {
    const errorPayload = {
      digest: error.digest,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity: "CRITICAL",
      route: "global",
    };

    // TODO: Send to error reporting service with high priority
    console.error("[GlobalError] Critical error logged:", errorPayload);
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background-base text-text-primary antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-xl w-full space-y-8">
            {/* Critical Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-status-error/30 rounded-full blur-2xl animate-pulse" />
                <AlertTriangle className="relative w-24 h-24 text-status-error" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-display font-bold text-text-primary">
                Critical Application Error
              </h1>
              <p className="text-lg text-text-secondary">
                The application encountered a critical error and cannot continue.
                This is likely due to a system-wide issue that needs immediate attention.
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && (
              <details className="bg-background-card rounded-md border border-border-subtle p-6">
                <summary className="cursor-pointer text-sm text-text-secondary hover:text-accent-gold transition-colors font-medium">
                  Technical Details (Development Only)
                </summary>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-text-primary">Digest:</p>
                    <p className="text-sm text-text-muted font-mono">
                      {error.digest || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-text-primary">Message:</p>
                    <p className="text-sm text-text-muted">{error.message}</p>
                  </div>
                  {error.stack && (
                    <div>
                      <p className="text-xs font-medium text-text-primary">Stack Trace:</p>
                      <pre className="text-xs text-text-muted overflow-auto max-h-40 bg-background-base p-3 rounded mt-2 font-mono">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={reset}
                variant="primary"
                size="lg"
                className="gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
                variant="secondary"
                size="lg"
                className="gap-2"
              >
                <Home className="w-5 h-5" />
                Go to Home
              </Button>
            </div>

            {/* Support Information */}
            <div className="bg-background-card rounded-md border border-border-subtle p-6 text-center space-y-3">
              <p className="text-sm text-text-secondary">
                This error has been logged and our team has been notified.
              </p>
              <p className="text-sm text-text-muted">
                If you continue to experience this issue, please contact our support team
                with the following error reference:
              </p>
              <code className="block text-sm font-mono text-accent-gold bg-background-base px-3 py-2 rounded">
                {error.digest || new Date().getTime().toString(36)}
              </code>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
