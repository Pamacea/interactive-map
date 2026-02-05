"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const logCriticalError = (error: Error & { digest?: string }): void => {
    const errorPayload = {
      digest: error.digest,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      severity: "CRITICAL",
      route: "global",
    };
    console.error("[GlobalError] Critical error logged:", errorPayload);
  };

  useEffect(() => {
    console.error("[GlobalError] Critical application error:", error);
    if (process.env.NODE_ENV === "production") {
      logCriticalError(error);
    }
  }, [error]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-void text-bone antialiased font-fell">
        <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 w-full max-w-3/5 space-y-8">
            <div className="absolute -top-20 -left-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow">ᛟ</div>
            <div className="absolute -top-20 -right-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow" style={{ animationDelay: "1s" }}>ᛞ</div>
            <div className="absolute -bottom-20 -left-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow" style={{ animationDelay: "2s" }}>ᛃ</div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-gold/20 rounded-sm blur-2xl animate-pulse" />
                <div className="relative w-24 h-24 flex items-center justify-center text-accent-gold">
                  <span className="text-6xl">⚠</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <p className="font-display text-xs tracking-[0.4em] text-bone-dark">THE FABRIC TEARS</p>
              <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider">
                Critical Error
              </h1>
              <p className="text-bone-dark text-sm sm:text-base max-w-2/3 mx-auto">
                The application has encountered a critical error and cannot continue.
                This shadow requires immediate attention.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <details className="bg-obsidian/60 backdrop-blur-sm border border-iron rounded-sm p-6">
                <summary className="cursor-pointer text-sm text-bone-dark hover:text-accent-gold transition-colors font-display tracking-wider">
                  Technical Details
                </summary>
                <div className="mt-4 space-y-3 font-mono text-xs">
                  <div>
                    <p className="font-medium text-accent-gold">Digest:</p>
                    <p className="text-bone-dark mt-1">{error.digest || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-accent-gold">Message:</p>
                    <p className="text-bone-dark mt-1">{error.message}</p>
                  </div>
                  {error.stack && (
                    <div>
                      <p className="font-medium text-accent-gold">Stack Trace:</p>
                      <pre className="text-bone-dark mt-1 overflow-auto max-h-40 bg-void/50 p-3 rounded">
                        {error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="px-8 py-3 bg-accent-gold/10 border-2 border-accent-gold text-accent-gold font-display tracking-wider hover:bg-accent-gold/20 transition-all duration-300 rounded-sm"
              >
                <span className="mr-2">↻</span> RELOAD
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className="px-8 py-3 bg-obsidian/60 border border-iron text-bone font-display tracking-wider hover:border-accent-gold hover:text-accent-gold transition-all duration-300 rounded-sm"
              >
                <span className="mr-2">⌂</span> HOME
              </button>
            </div>

            <div className="bg-obsidian/60 backdrop-blur-sm border border-iron rounded-sm p-6 text-center space-y-3">
              <p className="text-sm text-bone-dark font-display">
                This error has been logged. The guardians have been notified.
              </p>
              <p className="text-xs text-bone-dark">
                Error Reference: <code className="text-accent-gold">{error.digest || new Date().getTime().toString(36)}</code>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
