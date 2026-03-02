"use client";

import { useEffect } from "react";
import { initSentry } from "@/shared/lib/sentry";

/**
 * Sentry Initialization Component
 *
 * Initializes Sentry for client-side error tracking.
 * Should be rendered once in the root layout.
 *
 * Only initializes in production when NEXT_PUBLIC_SENTRY_DSN is set.
 */
export function SentryInit() {
  useEffect(() => {
    // Initialize Sentry on client-side
    initSentry();
  }, []);

  return null;
}
