"use client";

import React from "react";
import { Button } from "@/components/ui/button";

/**
 * Error Test Button Component
 *
 * FOR DEVELOPMENT/TESTING ONLY
 * This component intentionally throws errors to test error boundaries.
 *
 * Usage:
 * <ErrorTestButton type="render" /> - Tests rendering errors
 * <ErrorTestButton type="handler" /> - Tests event handler errors (not caught by error boundaries)
 * <ErrorTestButton type="async" /> - Tests async errors (not caught by error boundaries)
 */
export function ErrorTestButton({
  type = "render",
}: {
  type?: "render" | "handler" | "async";
}) {
  const [shouldThrow, setShouldThrow] = React.useState(false);

  // Test 1: Rendering error (CAUGHT by error boundary)
  if (type === "render" && shouldThrow) {
    throw new Error(
      "[TEST] This is a simulated rendering error to test error boundaries"
    );
  }

  // Test 2: Event handler error (NOT CAUGHT by error boundary)
  const handleEventHandlerError = () => {
    try {
      throw new Error(
        "[TEST] This is an event handler error - NOT caught by error boundaries"
      );
    } catch (error) {
      console.error("[ErrorTestButton] Event handler error:", error);
      alert("Event handler error! Check console for details.");
    }
  };

  // Test 3: Async error (NOT CAUGHT by error boundary)
  const handleAsyncError = async () => {
    try {
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(
            new Error(
              "[TEST] This is an async error - NOT caught by error boundaries"
            )
          );
        }, 100);
      });
    } catch (error) {
      console.error("[ErrorTestButton] Async error:", error);
      alert("Async error! Check console for details.");
    }
  };

  return (
    <div className="space-y-4 p-6 bg-background-card rounded-md border border-border-subtle">
      <h3 className="text-lg font-display font-semibold text-text-primary">
        Error Boundary Tests
      </h3>
      <p className="text-sm text-text-secondary">
        These buttons test different types of errors. Only rendering errors are
        caught by error boundaries.
      </p>

      <div className="flex flex-col gap-3">
        {/* Test 1: Rendering Error */}
        <div className="space-y-2">
          <p className="text-xs text-text-muted">
            1. Rendering Error (CAUGHT by error boundary):
          </p>
          <Button
            onClick={() => setShouldThrow(true)}
            variant="outline"
            className="w-full"
          >
            Trigger Rendering Error
          </Button>
          <p className="text-xs text-text-muted">
            This will throw an error during rendering, which the error boundary
            will catch and display a fallback UI.
          </p>
        </div>

        {/* Test 2: Event Handler Error */}
        <div className="space-y-2">
          <p className="text-xs text-text-muted">
            2. Event Handler Error (NOT CAUGHT):
          </p>
          <Button
            onClick={handleEventHandlerError}
            variant="secondary"
            className="w-full"
          >
            Trigger Event Handler Error
          </Button>
          <p className="text-xs text-text-muted">
            This will throw an error in an event handler. Error boundaries don't
            catch these - we handle them manually with try/catch.
          </p>
        </div>

        {/* Test 3: Async Error */}
        <div className="space-y-2">
          <p className="text-xs text-text-muted">
            3. Async Error (NOT CAUGHT):
          </p>
          <Button
            onClick={handleAsyncError}
            variant="secondary"
            className="w-full"
          >
            Trigger Async Error
          </Button>
          <p className="text-xs text-text-muted">
            This will throw an error in async code. Error boundaries don't catch
            these - we handle them with try/catch in the async function.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3 bg-background-base rounded border border-status-error/30">
        <p className="text-xs text-status-error font-medium">
          ⚠️ Development Only
        </p>
        <p className="text-xs text-text-muted">
          Remove this component in production. It's only for testing error
          boundaries during development.
        </p>
      </div>
    </div>
  );
}
