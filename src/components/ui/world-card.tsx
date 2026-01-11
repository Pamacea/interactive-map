import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorldCardProps {
  id: string;
  title: string;
  description: string | null;
  map: string | null;
  pinCount: number;
  loreCount: number;
  author: {
    name: string | null;
    image: string | null;
  };
  isPublic?: boolean;
  viewMode?: "grid" | "list";
  className?: string;
}

export function WorldCard({
  id,
  title,
  description,
  map,
  pinCount,
  loreCount,
  author,
  isPublic = true,
  viewMode = "grid",
  className,
}: WorldCardProps) {
  return (
    <Link
      href={`/world/${id}`}
      className={cn(
        "group relative",
        "bg-background-card/60 backdrop-blur-sm",
        "rounded-lg",
        "border border-border-subtle",
        "hover:border-accent-gold/40",
        "overflow-hidden",
        "transition-all duration-300",
        "hover:bg-muted",
        "cursor-pointer",
        viewMode === "list" && "flex flex-row",
        className
      )}
    >
      <CoverImage map={map} title={title} isPublic={isPublic} viewMode={viewMode} />
      <Content title={title} description={description} pinCount={pinCount} loreCount={loreCount} author={author} viewMode={viewMode} />
    </Link>
  );
}

function CoverImage({ map, title, isPublic, viewMode }: { map?: string | null; title: string; isPublic: boolean; viewMode?: "grid" | "list" }) {
  if (viewMode === "list") {
    return (
      <div className="relative w-48 h-32 flex-shrink-0 overflow-hidden bg-gradient-to-br from-background-card to-background-elevated">
        {map ? (
          <Image
            src={map}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-background-card via-background-elevated to-background-card" />
        )}
        {!isPublic && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-background-base/90 backdrop-blur-md rounded text-xs border border-border-subtle">
            <span className="text-[10px] font-medium text-text-muted">Private</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-background-card to-background-elevated">
      {map ? (
        <Image
          src={map}
          alt={title}
          fill
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background-card via-background-elevated to-background-card" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/80 to-transparent" />

      {!isPublic && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-background-base/90 backdrop-blur-md rounded-md border border-border-subtle">
          <span className="text-xs font-medium text-text-muted">Private</span>
        </div>
      )}
    </div>
  );
}

function Content({ title, description, pinCount, loreCount, author, viewMode }: Omit<WorldCardProps, "id" | "map" | "isPublic" | "className" | "viewMode"> & { viewMode?: "grid" | "list" }) {
  return (
    <div className={cn(
      "relative z-10 p-4 sm:p-6 flex flex-col gap-4",
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
    <h3 className="text-xl font-display font-semibold text-text-primary group-hover:text-accent-gold transition-colors line-clamp-1">
      {title}
    </h3>
  );
}

function Description({ description }: { description: string | null }) {
  if (!description) return null;

  return (
    <p className="text-base text-text-secondary line-clamp-2 min-h-[2.5rem] leading-relaxed">
      {description}
    </p>
  );
}

function Meta({ pinCount, loreCount }: { pinCount: number; loreCount: number }) {
  return (
    <div className="flex items-center gap-3 text-sm text-text-muted">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4" />
        <span>{pinCount} pins</span>
      </div>
      <div className="w-px h-3 bg-border-subtle" />
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-4 h-4" />
        <span>{loreCount} lore</span>
      </div>
    </div>
  );
}

function Footer({ author }: { author: { name: string | null; image?: string | null } }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
      <Author name={author.name} />
      <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-gold transition-all" />
    </div>
  );
}

function Author({ name }: { name: string | null }) {
  if (!name) return null;

  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} />
      <span className="text-sm text-text-secondary">{name}</span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-xs font-bold text-background-base">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
