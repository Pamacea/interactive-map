"use client";

import { useEffect, ReactNode } from "react";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { captureException, addSentryBreadcrumb } from "@/shared/lib/sentry";

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

      // Send to Sentry in production
      if (process.env.NODE_ENV === "production") {
        addSentryBreadcrumb(
          "Unhandled Promise Rejection",
          "promise",
          "error",
          { reason: String(event.reason) }
        );
        captureException(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
      }
    };

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalErrorHandler] Uncaught Error:", event.error);

      // Prevent default browser error logging
      event.preventDefault();

      // Send to Sentry in production
      if (process.env.NODE_ENV === "production") {
        addSentryBreadcrumb(
          "Uncaught Error",
          "window",
          "error",
          { message: event.message, filename: event.filename, lineno: event.lineno }
        );
        captureException(event.error);
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
 * Report error to Sentry
 */
function reportError(error: unknown): void {
  // Capture error details for Sentry
  const errorContext = {
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };

  captureException(error, errorContext);
}
