import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WorldCardProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage?: string;
  pinCount: number;
  loreCount: number;
  author: {
    name: string;
    image?: string;
  };
  isPublic?: boolean;
  className?: string;
}

export function WorldCard({
  id,
  slug,
  title,
  description,
  coverImage,
  pinCount,
  loreCount,
  author,
  isPublic = true,
  className,
}: WorldCardProps) {
  return (
    <Link
      href={`/world/${slug}`}
      className={cn(
        "group relative",
        "bg-background-card/60 backdrop-blur-sm",
        "rounded-sm",
        "border border-border-subtle",
        "hover:border-accent-gold/40",
        "overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-2xl hover:shadow-accent-gold/10",
        "hover:-translate-y-1",
        "cursor-pointer",
        className
      )}
    >
      <CardGlow />
      <CoverImage coverImage={coverImage} title={title} isPublic={isPublic} />
      <Content title={title} description={description} pinCount={pinCount} loreCount={loreCount} author={author} />
    </Link>
  );
}

function CardGlow() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-gold/20 via-transparent to-accent-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
    </>
  );
}

function CoverImage({ coverImage, title, isPublic }: { coverImage?: string; title: string; isPublic: boolean }) {
  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-background-card to-background-elevated">
      {coverImage ? (
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-background-card via-background-elevated to-background-card" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background-base via-background-base/80 to-transparent" />

      {!isPublic && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-background-base/90 backdrop-blur-md rounded-sm border border-border-subtle">
          <span className="text-xs font-medium text-text-muted">Private</span>
        </div>
      )}
    </div>
  );
}

function Content({ title, description, pinCount, loreCount, author }: Omit<WorldCardProps, "id" | "slug" | "coverImage" | "isPublic" | "className">) {
  return (
    <div className="relative z-10 p-4 sm:p-6 space-y-3 sm:space-y-4">
      <Title title={title} />
      <Description description={description} />
      <Meta pinCount={pinCount} loreCount={loreCount} />
      <Footer author={author} />
    </div>
  );
}

function Title({ title }: { title: string }) {
  return (
    <h3 className="text-lg sm:text-xl font-display font-semibold text-text-primary group-hover:text-accent-gold transition-colors line-clamp-1">
      {title}
    </h3>
  );
}

function Description({ description }: { description: string }) {
  return (
    <p className="text-sm text-text-secondary line-clamp-2 min-h-[2.5rem] leading-relaxed">
      {description}
    </p>
  );
}

function Meta({ pinCount, loreCount }: { pinCount: number; loreCount: number }) {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <div className="flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5" />
        <span>{pinCount} pins</span>
      </div>
      <div className="w-px h-3 bg-border-subtle" />
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5" />
        <span>{loreCount} lore</span>
      </div>
    </div>
  );
}

function Footer({ author }: { author: { name: string } }) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
      <Author name={author.name} />
      <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-gold group-hover:translate-x-1 transition-all" />
    </div>
  );
}

function Author({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={name} />
      <span className="text-xs text-text-secondary">{name}</span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-accent-gold to-accent-gold-dark flex items-center justify-center text-xs font-bold text-background-base shadow-lg">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
