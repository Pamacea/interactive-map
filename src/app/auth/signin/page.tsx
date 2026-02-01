"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { CrownButton } from "@/components/ui/crown-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, Crown } from "lucide-react";
import { FloatingParticles } from "@/components/ui/particles";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(provider);
      setError(null);
      await signIn(provider, { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void p-4 relative overflow-hidden">
      {/* Fixed Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grain opacity-[0.04]" aria-hidden="true" />
        <FloatingParticles />
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-gold/5 rounded-sm blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-3/5 bg-obsidian/80 backdrop-blur-md border border-iron rounded-sm p-6 sm:p-10 shadow-xl relative z-10 animate-oath-reveal">
        {/* Decorative Corner Runes */}
        <div className="absolute top-4 left-4 text-accent-gold-dark opacity-30 text-sm animate-rune-glow">ᛟ</div>
        <div className="absolute top-4 right-4 text-accent-gold-dark opacity-30 text-sm animate-rune-glow" style={{ animationDelay: "1s" }}>ᛞ</div>
        <div className="absolute bottom-4 left-4 text-accent-gold-dark opacity-30 text-sm animate-rune-glow" style={{ animationDelay: "2s" }}>ᛃ</div>
        <div className="absolute bottom-4 right-4 text-accent-gold-dark opacity-30 text-sm animate-rune-glow" style={{ animationDelay: "3s" }}>ᛊ</div>

        <div className="space-y-6 text-center relative z-10">
          {/* Crown Icon */}
          <div className="text-5xl text-accent-gold/20 mb-4 flex justify-center">
            <Crown className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" strokeWidth={1} />
          </div>

          {/* Decorative Lines */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-accent-gold/50 to-accent-gold" />
            <span className="text-accent-gold-dark opacity-50 text-lg animate-rune-glow">ᛟ</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent via-accent-gold/50 to-accent-gold" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <p className="font-display text-xs tracking-[0.4em] text-bone-dark">
              ENTER THE REALM
            </p>
            <h1 className="font-display-ornate text-4xl sm:text-5xl text-accent-gold tracking-wider">
              GENESIS
            </h1>
            <p className="font-fell text-bone-dark text-sm">
              Sign in to craft your world
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="border-blood/50 bg-blood/10">
              <AlertDescription className="text-bone">{error}</AlertDescription>
            </Alert>
          )}

          {/* Sign In Buttons */}
          <div className="space-y-3 pt-4">
            <CrownButton
              onClick={() => handleSignIn("github")}
              variant="gold"
              size="lg"
              className="w-full flex items-center justify-center"
              disabled={isLoading !== null}
              aria-label="Sign in with GitHub"
            >
              {isLoading === "github" ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Continue with GitHub
                </>
              )}
            </CrownButton>

            <CrownButton
              onClick={() => handleSignIn("discord")}
              variant="iron"
              size="lg"
              className="w-full"
              disabled={isLoading !== null}
              aria-label="Sign in with Discord"
            >
              {isLoading === "discord" ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Continue with Discord
                </>
              )}
            </CrownButton>
          </div>

          {/* Terms */}
          <p className="font-fell text-xs text-bone-dark/70 pt-4 border-t border-iron/50">
            By signing in, you agree to our{" "}
            <a href="/terms" className="text-accent-gold hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent-gold hover:underline">
              Privacy Policy
            </a>
          </p>

          {/* Bottom Seal */}
          <div className="pt-4 flex justify-center">
            <div className="w-12 h-12 border border-accent-gold-dark/50 rounded-sm flex items-center justify-center">
              <LogIn className="w-5 h-5 text-accent-gold-dark" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
