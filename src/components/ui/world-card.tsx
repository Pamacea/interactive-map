import Link from "next/link";
import Image from "next/image";
import { memo } from "react";
import { ArrowRight, MapPin, BookOpen, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorldCardProps } from "@/types/components.type";

export const WorldCard = memo(function WorldCard({
  id,
  title,
  description,
  map,
  _count,
  user,
  isPublic = true,
  viewMode = "grid",
  className,
}: WorldCardProps) {
  const pinCount = _count?.pins ?? 0;
  const loreCount = _count?.loreEntries ?? 0;

  if (viewMode === "list") {
    return (
      <Link
        href={`/world/${id}`}
        className={cn(
          "group relative w-full",
          "bg-obsidian/40 backdrop-blur-sm",
          "border border-iron",
          "hover:border-accent-gold/50",
          "overflow-hidden",
          "transition-all duration-300",
          "hover:bg-obsidian/60 hover:-translate-y-0.5",
          "cursor-pointer",
          "flex flex-row",
          className
        )}
      >
        {/* Gold Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-gold/40" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-gold/40" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-gold/40" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-gold/40" />

        {/* Cracked Background Overlay */}
        <div className="absolute inset-0 bg-crack-pattern opacity-[0.03] pointer-events-none" />

        <CoverImage map={map} title={title} isPublic={isPublic} viewMode={viewMode} />
        <Content title={title} description={description} pinCount={pinCount} loreCount={loreCount} author={user} viewMode={viewMode} />
      </Link>
    );
  }

  return (
    <div className={cn(
      "group relative w-full bg-obsidian/40 backdrop-blur-sm border border-iron hover:border-accent-gold/50 overflow-hidden transition-all duration-300 hover:bg-obsidian/60 hover:-translate-y-1 cursor-pointer",
      className
    )}>
      {/* Gold Corners - Ornate */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent-gold/50 group-hover:border-accent-gold transition-colors" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent-gold/50 group-hover:border-accent-gold transition-colors" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent-gold/50 group-hover:border-accent-gold transition-colors" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent-gold/50 group-hover:border-accent-gold transition-colors" />

      {/* Cracked Background Effect */}
      <div className="absolute inset-0 bg-crack-pattern opacity-[0.04] pointer-events-none" />

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-void/20 pointer-events-none" />

      <Link href={`/world/${id}`} className="block relative z-10">
        <CoverImage map={map} title={title} isPublic={isPublic} viewMode={viewMode} />
        <div className="p-4 sm:p-5">
          <Title title={title} />
          <Description description={description} />
          <Meta pinCount={pinCount} loreCount={loreCount} />
          <Footer author={user} />
        </div>
      </Link>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps._count?.pins === nextProps._count?.pins &&
    prevProps._count?.loreEntries === nextProps._count?.loreEntries &&
    prevProps.viewMode === nextProps.viewMode
  );
});

const CoverImage = memo(function CoverImage({ map, title, isPublic, viewMode }: { map?: string | null; title: string; isPublic: boolean; viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-gradient-to-br from-void to-stone">
        {map ? (
          <Image
            src={map}
            alt={title}
            fill
            sizes="(max-width: 768px) 192px, 192px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-void via-stone to-void" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
        {!isPublic && <PrivateBadge />}
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-void via-stone to-void">
      {map ? (
        <Image
          src={map}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-void via-stone to-void" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/80 to-transparent" />
      {!isPublic && <PrivateBadge />}
    </div>
  );
});

function PrivateBadge() {
  return (
    <div className="absolute top-2 right-2 px-2 py-1 bg-void/80 backdrop-blur-md border border-accent-gold/30 flex items-center gap-1">
      <Lock className="w-3 h-3 text-accent-gold" strokeWidth={1.5} />
      <span className="text-[10px] font-display tracking-wide text-accent-gold">PRIVATE</span>
    </div>
  );
}

function Content({ title, description, pinCount, loreCount, author, viewMode }: { title: string; description: string | null; pinCount: number; loreCount: number; author: { name: string | null; image?: string | null }; viewMode?: "grid" | "list" }) {
  return (
    <div className={cn(
      "relative z-10 p-4 sm:p-5 flex flex-col gap-3",
      viewMode === "list" && "flex-1 justify-center"
    )}>
      <Title title={title} />
      {viewMode === "grid" && <Description description={description} />}
      <Meta pinCount={pinCount} loreCount={loreCount} />
      {viewMode === "grid" && <Footer author={author} />}
    </div>
  );
}

function Title({ title }: { title: string }) {
  return (
    <h3 className="text-lg sm:text-xl font-display font-semibold text-bone group-hover:text-accent-gold transition-colors line-clamp-1">
      {title}
    </h3>
  );
}

function Description({ description }: { description: string | null }) {
  if (!description) return null;
  return (
    <p className="text-sm text-bone-dark line-clamp-2 leading-relaxed font-fell">
      {description}
    </p>
  );
}

function Meta({ pinCount, loreCount }: { pinCount: number; loreCount: number }) {
  return (
    <div className="flex items-center gap-4 text-xs text-bone-dark pt-2">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-accent-gold/60" strokeWidth={1.5} />
        <span className="font-display tracking-wide">{pinCount}</span>
      </div>
      <div className="w-px h-3 bg-iron" />
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-accent-gold/60" strokeWidth={1.5} />
        <span className="font-display tracking-wide">{loreCount}</span>
      </div>
    </div>
  );
}

function Footer({ author }: { author: { name: string | null; image?: string | null } }) {
  return (
    <div className="flex items-center justify-between pt-3 mt-1 border-t border-iron/50">
      <Author name={author.name} />
      <ArrowRight className="w-4 h-4 text-bone-dark group-hover:text-accent-gold group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
    </div>
  );
}

function Author({ name }: { name: string | null }) {
  if (!name) return null;
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} />
      <span className="text-xs text-bone-dark font-fell">{name}</span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-5 h-5 bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
      <span className="text-[10px] font-display font-semibold text-accent-gold">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}
