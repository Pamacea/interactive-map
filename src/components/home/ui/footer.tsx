import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 sm:py-16 px-6 bg-obsidian border-t border-iron">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <span className="text-xl font-display-ornate font-bold text-gradient tracking-wider">
            GENESIS
          </span>
          <span className="text-xs text-bone-dark tracking-widest">
            Atlas Builder
          </span>
          <span className="text-xs text-bone-dark/60 mt-2">
            — MMXXVI —
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-bone-dark">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/explore">Explore</FooterLink>
          <FooterLink href="/docs">Docs</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
        </div>

        <div className="text-center md:text-right">
          <p className="text-xs text-bone-dark">© 2026 Genesis. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-accent-gold transition-colors font-display tracking-wide"
    >
      {children}
    </Link>
  );
}
