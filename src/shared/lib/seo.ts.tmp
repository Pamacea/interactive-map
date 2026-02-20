import type { Metadata } from "next"
import { siteConfig } from "@/config/site"

export interface SeoMetadataProps {
  title: string
  description?: string
  image?: string
  type?: "website" | "article"
  publishedTime?: string
  modifiedTime?: string
  keywords?: string[]
  canonical?: string
}

export function createMetadata(props: SeoMetadataProps): Metadata {
  const {
    title,
    description = siteConfig.description,
    image = siteConfig.ogImage,
    type = "website",
    publishedTime,
    modifiedTime,
    keywords,
    canonical,
  } = props

  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image}`

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords || siteConfig.seo.keywords,
    authors: [{ name: siteConfig.author.name }],
    creator: siteConfig.author.name,
    openGraph: {
      type,
      title,
      description,
      url: canonical ? `${siteConfig.url}${canonical}` : siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteConfig.seo.twitterCreator,
      images: [imageUrl],
    },
    ...(canonical && {
      alternates: {
        canonical: `${siteConfig.url}${canonical}`,
      },
    }),
  }

  return metadata
}

export function getCanonicalUrl(path: string): string {
  return `${siteConfig.url}${path}`
}
