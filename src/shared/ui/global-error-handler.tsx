"use client";

import { useEffect, ReactNode } from "react";
import { ErrorBoundary } from "@/shared/ui/error-boundary";

interface GlobalErrorHandlerProps {
  children: ReactNode;
}

/**
 * Global Error Handler Component
 *
 * Wraps the entire application with error boundary and global error handling.
 * Catches unhandled errors, promise rejections, and provides error reporting.
 *
 * Based on Next.js 16 error handling:
 * https://nextjs.org/docs/app/getting-started/error-handling
 */
export function GlobalErrorHandler({ children }: GlobalErrorHandlerProps) {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("[GlobalErrorHandler] Unhandled Promise Rejection:", event.reason);

      // Prevent default browser error logging (we handle it ourselves)
      event.preventDefault();

      // In production, send to error reporting service
      if (process.env.NODE_ENV === "production") {
        // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
        reportError(event.reason);
      }
    };

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalErrorHandler] Uncaught Error:", event.error);

      // Prevent default browser error logging
      event.preventDefault();

      // In production, send to error reporting service
      if (process.env.NODE_ENV === "production") {
        // TODO: Send to error reporting service
        reportError(event.error);
      }
    };

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    // Cleanup
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return <ErrorBoundary>{children}</ErrorBoundary>;
}

/**
 * Report error to external service
 * Placeholder for future error reporting integration
 */
function reportError(error: unknown): void {
  // Prepare error payload
  const errorPayload = {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // TODO: Send to error reporting service
  // Example: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorPayload) });

  // For now, just log to console
  console.error("[GlobalErrorHandler] Error reported:", errorPayload);
}
