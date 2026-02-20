import { JsonLd } from "./JsonLd"
import { siteConfig } from "@/config/site"

export interface CreativeWorkSchemaProps {
  name: string
  description?: string
  image?: string
  dateCreated: string
  dateModified?: string
  author?: string
  keywords?: string[]
}

export function CreativeWorkSchema({
  name,
  description,
  image,
  dateCreated,
  dateModified,
  author = siteConfig.author.name,
  keywords,
}: CreativeWorkSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    ...(description && { description }),
    ...(image && { image: image.startsWith("http") ? image : `${siteConfig.url}${image}` }),
    dateCreated,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Person",
      name: author,
    },
    ...(keywords && { keywords: keywords.join(", ") }),
  }

  return <JsonLd data={data} />
}
