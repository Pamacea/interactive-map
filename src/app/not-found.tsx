import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-[0.04] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-3/5 space-y-8 text-center">
        <div className="absolute -top-20 -left-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow">ᛟ</div>
        <div className="absolute -top-20 -right-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow" style={{ animationDelay: "1s" }}>ᛞ</div>
        <div className="absolute -bottom-20 -left-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow" style={{ animationDelay: "2s" }}>ᛃ</div>
        <div className="absolute -bottom-20 -right-20 text-accent-gold-dark opacity-20 text-5xl animate-rune-glow" style={{ animationDelay: "3s" }}>ᛊ</div>

        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-accent-gold/20 rounded-sm blur-2xl animate-pulse" />
            <div className="relative">
              <p className="font-display-ornate text-8xl sm:text-9xl text-accent-gold/30">404</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="font-display text-xs tracking-[0.4em] text-bone-dark">BEYOND THE KNOWN REALMS</p>
          <h1 className="font-display-ornate text-3xl sm:text-4xl text-accent-gold tracking-wider">
            Page Not Found
          </h1>
          <p className="text-bone-dark text-sm sm:text-base max-w-2/3 mx-auto">
            The page you seek does not exist in this realm. It may have been moved,
            destroyed, or never existed at all.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-accent-gold/10 border-2 border-accent-gold text-accent-gold font-display tracking-wider hover:bg-accent-gold/20 transition-all duration-300 rounded-sm inline-flex items-center justify-center"
          >
            <span className="mr-2">⌂</span> HOME
          </Link>
          <Link
            href="/worlds"
            className="px-8 py-3 bg-obsidian/60 border border-iron text-bone font-display tracking-wider hover:border-accent-gold hover:text-accent-gold transition-all duration-300 rounded-sm inline-flex items-center justify-center"
          >
            <span className="mr-2">≡</span> WORLDS
          </Link>
        </div>

        <p className="font-display text-xs tracking-[0.3em] text-bone-dark">
          &ldquo;Not all who wander are lost, but some pages truly are.&rdquo;
        </p>
      </div>
    </div>
  );
}