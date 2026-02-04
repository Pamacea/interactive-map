import { getLoreEntryBySlug, getLoreEntriesByWorld } from "@/actions/lore";
import { getWorldWithData } from "@/actions/worlds";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { LoreDetailClient } from "@/components/lore/ui/lore-detail-client";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ArticleSchema } from "@/shared/components/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  const lore = await getLoreEntryBySlug(id, slug);

  if (!lore) {
    return {
      title: "Lore Entry Not Found",
    };
  }

  const title = lore.title;
  const description =
    lore.content?.substring(0, 160) ||
    `Read about ${lore.title} on Genesis.`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteConfig.url}/world/${id}/lore/${slug}`,
      article: {
        publishedTime: lore.createdAt.toISOString(),
        modifiedTime: lore.updatedAt.toISOString(),
        authors: [lore.user?.name || "Unknown Author"],
      },
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/world/${id}/lore/${slug}`,
    },
  };
}

export default async function LoreDetailPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  const [lore, world, allLoreEntries, session] = await Promise.all([
    getLoreEntryBySlug(id, slug),
    getWorldWithData(id),
    getLoreEntriesByWorld(id),
    auth(),
  ]);

  if (!lore || !world) {
    notFound();
  }

  // Check if user has access
  const isAuthenticated = !!session?.user;
  const isOwner = session?.user?.id === lore.userId;
  const isWorldMember = world.members.some((m) => m.userId === session?.user?.id);
  const canView = lore.isVisible || isOwner || isWorldMember;

  if (!canView) {
    notFound();
  }

  const imageUrl = world.map
    ? world.map.startsWith("http")
      ? world.map
      : `${siteConfig.url}${world.map}`
    : `${siteConfig.url}${siteConfig.ogImage}`;

  return (
    <>
      <ArticleSchema
        name={lore.title}
        headline={lore.title}
        description={lore.content?.substring(0, 160)}
        image={imageUrl}
        datePublished={lore.createdAt.toISOString()}
        dateModified={lore.updatedAt.toISOString()}
        author={lore.user?.name || "Unknown"}
      />
      <LoreDetailClient
        lore={lore}
        world={world}
        allLoreEntries={allLoreEntries}
        isAuthenticated={isAuthenticated}
        isOwner={isOwner}
        isWorldMember={isWorldMember}
        currentUserId={session?.user?.id}
      />
    </>
  );
}
