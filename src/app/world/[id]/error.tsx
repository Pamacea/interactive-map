"use client";

import { useEffect } from "react";

export default function WorldError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const logErrorToService = (error: Error & { digest?: string }): void => {
    const errorPayload = {
      digest: error.digest,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      route: "world/[id]",
    };
    console.error("[WorldError] Logged:", errorPayload);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[WorldError] Error details:", error);
    }
    if (process.env.NODE_ENV === "production") {
      logErrorToService(error);
    }
  }, [error]);

  return (
    <div className="h-screen bg-void flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-3/5 space-y-8">
        <div className="absolute -top-16 -left-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow">ᛟ</div>
        <div className="absolute -top-16 -right-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow" style={{ animationDelay: "1s" }}>ᛞ</div>
        <div className="absolute -bottom-16 -left-16 text-accent-gold-dark opacity-20 text-4xl animate-rune-glow" style={{ animationDelay: "2s" }}>ᛃ</div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-gold/20 rounded-sm blur-xl animate-pulse" />
            <div className="relative w-20 h-20 flex items-center justify-center text-accent-gold">
              <span className="text-5xl">⚠</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 text-center">
          <p className="font-display text-xs tracking-[0.4em] text-bone-dark">THE WORLD FADES</p>
          <h1 className="font-display-ornate text-3xl sm:text-4xl text-accent-gold tracking-wider">
            World Error
          </h1>
          <p className="text-bone-dark text-sm max-w-2/3 mx-auto">
            We encountered an error while loading this world. This might be due to:
          </p>
          <ul className="text-left text-bone-dark space-y-2 max-w-2/3 mx-auto text-sm">
            <li className="flex gap-2">
              <span className="text-accent-gold">᛫</span>
              <span>Missing or corrupted world data</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-gold">᛫</span>
              <span>Network connection issues</span>
            </li>
            <li className="flex gap-2">
              <span className="text-accent-gold">᛫</span>
              <span>Temporary server problem</span>
            </li>
          </ul>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="bg-obsidian/60 backdrop-blur-sm border border-iron rounded-sm p-4">
            <summary className="cursor-pointer text-sm text-bone-dark hover:text-accent-gold transition-colors font-display tracking-wider">
              Technical Details
            </summary>
            <div className="mt-3 space-y-2 font-mono text-xs">
              <p className="text-bone-dark"><span className="font-medium text-accent-gold">Digest:</span> {error.digest || "N/A"}</p>
              <p className="text-bone-dark"><span className="font-medium text-accent-gold">Message:</span> {error.message}</p>
              {error.stack && (
                <pre className="text-bone-dark overflow-auto max-h-32 bg-void/50 p-2 rounded">{error.stack}</pre>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-accent-gold/10 border-2 border-accent-gold text-accent-gold font-display tracking-wider hover:bg-accent-gold/20 transition-all duration-300 rounded-sm"
          >
            <span className="mr-2">↻</span> TRY AGAIN
          </button>
          <button
            onClick={() => window.location.href = "/worlds"}
            className="px-6 py-3 bg-obsidian/60 border border-iron text-bone font-display tracking-wider hover:border-accent-gold hover:text-accent-gold transition-all duration-300 rounded-sm"
          >
            <span className="mr-2">⌂</span> WORLDS
          </button>
        </div>

        <p className="text-center text-sm text-bone-dark">
          If the problem persists, try{" "}
          <button
            onClick={() => window.location.reload()}
            className="text-accent-gold hover:underline"
          >
            refreshing the page
          </button>
          {" "}or seek guidance from the support.
        </p>
      </div>
    </div>
  );
}
