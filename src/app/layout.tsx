import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/@config/Layout";
import { GlobalErrorHandler } from "@/components/@config/error-handler";
import { siteConfig } from "@/config/site";
import { WebSiteSchema, OrganizationSchema } from "@/shared/components/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.seo.twitterCreator,
    images: [siteConfig.ogImage],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <WebSiteSchema />
        <OrganizationSchema />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <GlobalErrorHandler />
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
