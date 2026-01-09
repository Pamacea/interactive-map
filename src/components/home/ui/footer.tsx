import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-border-subtle">
      <div className="max-w-2/3 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <FooterLogo />
          <FooterLinks />
          <FooterCopyright />
        </div>
      </div>
    </footer>
  );
}

function FooterLogo() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xl font-display font-bold text-gradient tracking-wider">
        GENESIS
      </span>
    </div>
  );
}

function FooterLinks() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm text-text-secondary">
      <FooterLink href="/about">About</FooterLink>
      <FooterLink href="/docs">Documentation</FooterLink>
      <FooterLink href="/privacy">Privacy</FooterLink>
      <FooterLink href="/terms">Terms</FooterLink>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-accent-gold transition-colors">
      {children}
    </Link>
  );
}

function FooterCopyright() {
  return <p className="text-sm text-text-muted">© 2026 Genesis. All rights reserved.</p>;
}
