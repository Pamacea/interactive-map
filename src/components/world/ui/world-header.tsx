import { MapPin, BookOpen } from "lucide-react";

interface WorldHeaderProps {
  slug: string;
}

export function WorldHeader({ slug }: WorldHeaderProps) {
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="p-6 border-b border-border-subtle">
      <h2 className="text-2xl font-display font-semibold text-text-primary mb-2">
        {title}
      </h2>
      <p className="text-sm text-text-muted">World description</p>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-2 text-text-muted">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">0 pins</span>
        </div>
        <div className="flex items-center gap-2 text-text-muted">
          <BookOpen className="w-4 h-4" />
          <span className="text-sm">0 lore entries</span>
        </div>
      </div>
    </div>
  );
}
