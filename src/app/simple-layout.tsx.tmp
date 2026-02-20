/**
 * Simple layout for pages that shouldn't have navigation
 * Used for /not-found to avoid SSR issues with useSession
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function SimpleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">{children}</div>
  );
}
