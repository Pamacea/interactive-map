import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

// Helper to fetch public worlds for sitemap
async function getPublicWorlds() {
  try {
    const { prisma } = await import("@/shared/lib/prisma")
    const worlds = await prisma.gameWorld.findMany({
      where: {
        isPublished: true,
        isPublic: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 1000, // Limit to 1000 worlds for sitemap
    })
    return worlds
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // Add dynamic routes for public worlds
  const publicWorlds = await getPublicWorlds()
  const worldRoutes: MetadataRoute.Sitemap = publicWorlds.map((world) => ({
    url: `${baseUrl}/world/${world.id}`,
    lastModified: world.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...worldRoutes]
}
