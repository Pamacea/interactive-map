import Link from "next/link";
import { MapPin } from "lucide-react";

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
      <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-dark rounded-lg flex items-center justify-center">
        <MapPin className="w-6 h-6 text-background-base" />
      </div>
      <span className="text-xl font-display font-bold text-gradient tracking-wider">
        REALM FORGE
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
  return <p className="text-sm text-text-muted">© 2026 Realm Forge. All rights reserved.</p>;
}
