"use client";

import { siteConfig } from "@/config/site";

/**
 * WebSite Schema Component
 *
 * Adds JSON-LD structured data for WebSite schema.
 * Helps search engines understand the website structure.
 *
 * @see https://schema.org/WebSite
 */
export function WebSiteSchema() {
  const _schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/explore?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(_schema) }}
    />
  );
}

/**
 * Organization Schema Component
 *
 * Adds JSON-LD structured data for Organization schema.
 * Helps search engines understand the organization/entity.
 *
 * @see https://schema.org/Organization
 */
export function OrganizationSchema() {
  const _schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    sameAs: [
      // Add social media links here
      // "https://twitter.com/yourhandle",
      // "https://github.com/yourhandle",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(_schema) }}
    />
  );
}

/**
 * Article Schema Component
 *
 * Adds JSON-LD structured data for Article schema.
 * Helps search engines understand article content (lore entries, blog posts, etc).
 *
 * @see https://schema.org/Article
 */
export function ArticleSchema({ article }: { article: {
  headline?: string;
  description?: string;
  image?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  url?: string;
}}) {
  const _schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline || siteConfig.name,
    description: article.description || siteConfig.description,
    image: article.image || `${siteConfig.url}/og-image.png`,
    author: {
      "@type": "Person",
      name: article.author || siteConfig.name,
    },
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || new Date().toISOString(),
    url: article.url || siteConfig.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(_schema) }}
    />
  );
}

/**
 * CreativeWork Schema Component
 *
 * Adds JSON-LD structured data for CreativeWork schema.
 * Helps search engines understand creative content (worlds, stories, etc).
 *
 * @see https://schema.org/CreativeWork
 */
export function CreativeWorkSchema({
  name,
  description,
  image,
  author,
  dateCreated,
  dateModified,
  url,
  genre = "Fantasy",
}: {
  name?: string;
  description?: string;
  image?: string;
  author?: string;
  dateCreated?: string;
  dateModified?: string;
  url?: string;
  genre?: string;
}) {
  const _schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: name || siteConfig.name,
    description: description || siteConfig.description,
    image: image || `${siteConfig.url}/og-image.png`,
    author: {
      "@type": "Person",
      name: author || siteConfig.name,
    },
    dateCreated: dateCreated || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    url: url || siteConfig.url,
    genre,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(_schema) }}
    />
  );
}
