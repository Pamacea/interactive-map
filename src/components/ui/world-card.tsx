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
        "group",
        "bg-[var(--color-background-card)]",
        "rounded-lg",
        "border border-[var(--color-border-subtle)]",
        "hover:border-[var(--color-border-ornate)]",
        "overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-lg",
        "cursor-pointer",
        className
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-video overflow-hidden bg-[var(--color-background-elevated)]">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-background-card)] to-[var(--color-background-elevated)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background-base)] via-[rgb(10_14_19/0.5)] to-transparent" />

        {/* Visibility Badge */}
        {!isPublic && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-[rgb(10_14_19/0.9)] backdrop-blur-sm rounded-md border border-[var(--color-border-subtle)]">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">Private</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-display font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-gold)] transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{pinCount} pins</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{loreCount} lore</span>
          </div>
        </div>

        {/* Author & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--color-accent-gold)] to-[var(--color-accent-gold-dark)] flex items-center justify-center text-xs font-bold text-[var(--color-background-base)]">
              {author.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-[var(--color-text-secondary)]">{author.name}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-gold)] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
