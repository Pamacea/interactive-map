/**
 * Sentry Configuration
 *
 * Error tracking and performance monitoring for Genesis Interactive Map
 *
 * Environment variables:
 * - NEXT_PUBLIC_SENTRY_DSN: Sentry DSN (required for production)
 * - NEXT_PUBLIC_SENTRY_ENVIRONMENT: Environment name (defaults to NODE_ENV)
 */

import * as Sentry from "@sentry/nextjs";
import { BrowserProfilingIntegration } from "@sentry/nextjs";
import type { ComponentType, ReactNode } from "react";
import type { ErrorInfo } from "react";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV || "development";

/**
 * Initialize Sentry for client-side
 * Only initializes in production if DSN is provided
 */
export function initSentry() {
  if (!SENTRY_DSN) {
    // Skip Sentry initialization in development or if DSN is not provided
    if (ENVIRONMENT === "production") {
      console.warn("[Sentry] NEXT_PUBLIC_SENTRY_DSN is not set. Error tracking is disabled.");
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,

    // Adjust the traces sample rate based on environment
    tracesSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,

    // Profile sample rate for performance monitoring
    profilesSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,

    // Replay settings
    replaysSessionSampleRate: ENVIRONMENT === "production" ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Integrations
    integrations: [
      new BrowserProfilingIntegration(),
      new Sentry.BrowserTracing({
        // Set custom trace propagation targets
        tracePropagationTargets: ["localhost", /^https:\/\/([^/]+\.)?genesis\.app/],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    // Filter out noisy errors
    beforeSend(event, hint) {
      // Ignore errors from browser extensions
      if (event.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename) {
        const filename = event.exception.values[0].stacktrace.frames[0].filename;
        if (filename?.includes("extension")) {
          return null;
        }
      }

      // Ignore specific error messages
      const errorMessage = event.exception?.values?.[0]?.value;
      const ignoredMessages = [
        "Non-Error promise rejection captured",
        "ResizeObserver loop limit exceeded",
        "Script error",
      ];

      if (errorMessage && ignoredMessages.some((msg) => errorMessage.includes(msg))) {
        return null;
      }

      return event;
    },

    // Attach user context when available
    beforeSendTransaction(event) {
      // Add custom tags based on route or feature
      if (event.request?.url) {
        const url = new URL(event.request.url);
        event.tags = {
          ...event.tags,
          pathname: url.pathname,
        };
      }
      return event;
    },
  });

  console.log("[Sentry] Initialized with environment:", ENVIRONMENT);
}

/**
 * Set user context for error tracking
 */
export function setSentryUser(user: { id: string; email?: string; name?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

/**
 * Clear user context (on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Add custom breadcrumb for debugging
 */
export function addSentryBreadcrumb(
  message: string,
  category: string = "custom",
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Capture a custom exception
 */
export function captureException(
  error: Error | unknown,
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.setContext("custom", context);
  }
  Sentry.captureException(error);
}

/**
 * Capture a custom message
 */
export function captureMessage(
  message: string,
  level: Sentry.SeverityLevel = "info",
  context?: Record<string, unknown>
) {
  if (context) {
    Sentry.setContext("custom", context);
  }
  Sentry.captureMessage(message, level);
}

/**
 * Start a performance transaction
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startInactiveSpan({
    name,
    op,
  });
}

/**
 * React Error Boundary component for Sentry
 */
import { ComponentType, ReactNode } from "react";
import { ErrorBoundary as SentryErrorBoundary } from "@sentry/nextjs";

interface SentryBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export function SentryBoundary({ children, fallback, onError }: SentryBoundaryProps) {
  return (
    <SentryErrorBoundary
      fallback={fallback}
      onError={(error, errorInfo) => {
        console.error("[Sentry] Error captured:", error);
        addSentryBreadcrumb(
          "React Error Boundary caught error",
          "react",
          "error",
          { componentStack: errorInfo.componentStack }
        );
        onError?.(error, errorInfo);
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
}
