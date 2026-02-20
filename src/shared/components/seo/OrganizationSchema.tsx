import { JsonLd } from "./JsonLd"
import { siteConfig } from "@/config/site"

export function OrganizationSchema() {
  const _data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: siteConfig.links.email,
    },
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
    ],
  }

  return <JsonLd data={data} />
}
