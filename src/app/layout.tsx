import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/@config/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interactive Map",
  description: "Advanced interactive map application with geospatial features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* Skip Link for Keyboard Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-gold focus:text-background-base focus:rounded-sm focus:font-medium focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Global Live Region for Screen Reader Announcements */}
        <div
          id="global-live-region"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />

        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
