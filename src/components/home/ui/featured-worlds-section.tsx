import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WorldCard } from "@/components/ui/world-card";
import { Button } from "@/components/ui/button";

const featuredWorlds = [
  {
    id: "1",
    slug: "eldoria-chronicles",
    title: "Eldoria Chronicles",
    description: "A vast high fantasy realm with ancient dragons, magical kingdoms, and epic wars that shaped the continent.",
    pinCount: 247,
    loreCount: 58,
    author: { name: "MythWeaver" },
    isPublic: true,
  },
  {
    id: "2",
    slug: "shadow-veil",
    title: "Shadow Veil",
    description: "Dark fantasy world torn between light and darkness, where demons walk among mortals.",
    pinCount: 189,
    loreCount: 42,
    author: { name: "DarkLord99" },
    isPublic: true,
  },
  {
    id: "3",
    slug: "azure-coast",
    title: "The Azure Coast",
    description: "Tropical archipelago of trading cities, pirates, and ancient sea temples.",
    pinCount: 156,
    loreCount: 35,
    author: { name: "SeaCaptain" },
    isPublic: true,
  },
];

export function FeaturedWorldsSection() {
  return (
    <section className="py-20 px-4">
      <header className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-2">
            Featured <span className="text-accent-gold">Worlds</span>
          </h2>
          <p className="text-text-secondary">
            Discover incredible worlds created by our community
          </p>
        </div>
        <Link
          href="/explore"
          className="hidden sm:inline-flex items-center gap-2 text-accent-gold hover:text-accent-gold-light transition-colors font-display font-medium"
        >
          View All Worlds
          <ArrowRight className="w-5 h-5" />
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredWorlds.map((world) => (
          <WorldCard key={world.id} {...world} />
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/explore">
          <Button variant="outline" size="lg">
            View All Worlds
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
