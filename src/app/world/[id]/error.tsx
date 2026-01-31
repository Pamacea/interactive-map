"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

/**
 * World Page Error Boundary
 *
 * Catches errors in the world editor page and provides recovery options.
 * This error boundary handles the world/[id] route specifically.
 *
 * According to Next.js 16 error handling:
 * https://nextjs.org/docs/app/getting-started/error-handling
 */
export default function WorldError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /**
   * Log error to external service
   */
  const logErrorToService = (error: Error & { digest?: string }): void => {
    const errorPayload = {
      digest: error.digest,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      route: "world/[id]",
    };

    // TODO: Send to error reporting service
    console.error("[WorldError] Logged:", errorPayload);
  };

  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[WorldError] Error details:", error);
    }

    // Log error to error reporting service in production
    if (process.env.NODE_ENV === "production") {
      logErrorToService(error);
    }
  }, [error]);

  return (
    <div className="h-screen bg-background-base flex items-center justify-center px-4">
      <div className=" w-full space-y-6">
        {/* Error Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-status-error/20 rounded-full blur-xl animate-pulse" />
            <AlertCircle className="relative w-20 h-20 text-status-error" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-display font-semibold text-text-primary">
            World Editor Error
          </h1>
          <p className="text-text-secondary">
            We encountered an error while loading this world. This might be due to:
          </p>
          <ul className="text-left text-text-muted space-y-2 max-w-md mx-auto">
            <li className="flex gap-2">
              <span className="text-accent-gold">•</span>
              <span>Missing or corrupted world data</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-gold">•</span>
              <span>Network connection issues</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-gold">•</span>
              <span>Temporary server problem</span>
            </li>
          </ul>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <details className="bg-background-card rounded-md border border-border-subtle p-4">
            <summary className="cursor-pointer text-sm text-text-secondary hover:text-accent-gold transition-colors font-medium">
              Technical Details (Development)
            </summary>
            <div className="mt-3 space-y-2">
              <p className="text-xs text-text-muted">
                <span className="font-medium">Digest:</span> {error.digest || "N/A"}
              </p>
              <p className="text-xs text-text-muted">
                <span className="font-medium">Message:</span> {error.message}
              </p>
              {error.stack && (
                <pre className="text-xs text-text-muted overflow-auto max-h-32 bg-background-base p-2 rounded">
                  {error.stack}
                </pre>
              )}
            </div>
          </details>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="primary"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = "/worlds"}
            variant="secondary"
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Worlds
          </Button>
        </div>

        {/* Additional Help */}
        <p className="text-center text-sm text-text-muted">
          If the problem persists, you can try{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-accent-gold hover:underline"
          >
            refreshing the page
          </button>
          {" "}or contact support.
        </p>
      </div>
    </div>
  );
}
