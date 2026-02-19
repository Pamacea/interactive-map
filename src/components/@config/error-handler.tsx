"use client";

import { useEffect } from "react";

/**
 * Global error handler to catch and log unhandled errors and promise rejections.
 * This helps debug issues like "[object Event]" errors.
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("[GlobalErrorHandler] Unhandled Promise Rejection:", {
        reason: event.reason,
        promise: event.promise,
        reasonString: String(event.reason),
        reasonType: typeof event.reason,
        reasonMessage: event.reason?.message,
        reasonStack: event.reason?.stack,
      });

      // Prevent the default browser error
      event.preventDefault();
    };

    // Handle uncaught errors
    const handleError = (event: ErrorEvent) => {
      console.error("[GlobalErrorHandler] Uncaught Error:", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        errorString: String(event.error),
      });
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
      window.removeEventListener("error", handleError);
    };
  }, []);

  return null;
}
