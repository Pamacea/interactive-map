import { JsonLd } from "./JsonLd"
import { siteConfig } from "@/config/site"

export interface ArticleSchemaProps {
  name: string
  headline: string
  description?: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}

export function ArticleSchema({
  name,
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = siteConfig.author.name,
}: ArticleSchemaProps) {
  const _data = {
    "@context": "https://schema.org",
    "@type": "Article",
    name,
    headline,
    ...(description && { description }),
    ...(image && { image: image.startsWith("http") ? image : `${siteConfig.url}${image}` }),
    datePublished,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Person",
      name: author,
    },
  }

  return <JsonLd data={data} />
}
