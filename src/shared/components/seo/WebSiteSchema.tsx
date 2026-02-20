import { JsonLd } from "./JsonLd"
import { siteConfig } from "@/config/site"

export function WebSiteSchema() {
  const _data = {
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
  }

  return <JsonLd data={data} />
}
