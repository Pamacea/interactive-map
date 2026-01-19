"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Based on Next.js 16 error handling:
 * https://nextjs.org/docs/app/getting-started/error-handling
 *
 * @example
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary] Caught error:", error);
      console.error("[ErrorBoundary] Error info:", errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, or custom logging endpoint
    if (process.env.NODE_ENV === "production") {
      // TODO: Integrate with error reporting service
      this.logErrorToService(error, errorInfo);
    }
  }

  /**
   * Reset error boundary state to allow recovery
   */
  reset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  /**
   * Log errors to external service (placeholder for future integration)
   */
  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo): void => {
    // Prepare error payload
    const errorPayload = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // TODO: Send to error reporting service
    // Example: fetch('/api/errors', { method: 'POST', body: JSON.stringify(errorPayload) });

    // For now, log to console in production as well
    console.error("[ErrorBoundary] Error logged:", errorPayload);
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-background-base px-4">
          <div className="max-w-md w-full space-y-6 text-center">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-gold/20 rounded-full blur-xl animate-pulse" />
                <AlertCircle className="relative w-20 h-20 text-accent-gold" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-semibold text-text-primary">
                Something went wrong
              </h1>
              <p className="text-text-secondary">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && this.state.error?.stack && (
              <details className="text-left bg-background-card rounded-md border border-border-subtle p-4">
                <summary className="cursor-pointer text-sm text-text-secondary hover:text-accent-gold transition-colors">
                  Error Details
                </summary>
                <pre className="pt-3 text-xs text-text-muted overflow-auto max-h-48">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.reset}
                variant="primary"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.href = "/"}
                variant="secondary"
              >
                Go Home
              </Button>
            </div>

            {/* Support Link */}
            <p className="text-sm text-text-muted">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
export function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error | null;
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background-base px-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="flex justify-center">
          <AlertCircle className="w-16 h-16 text-accent-gold" />
        </div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">
          Something went wrong
        </h1>
        <p className="text-text-secondary">
          {error?.message || "An unexpected error occurred"}
        </p>
        <Button onClick={reset} variant="primary" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}
