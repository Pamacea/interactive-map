import { MapPin, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface WorldHeaderProps {
  slug: string;
}

export function WorldHeader({ slug }: WorldHeaderProps) {
  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Card className="border-border-subtle">
      <CardHeader>
        <CardTitle className="text-2xl font-display font-semibold text-text-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-text-muted">World description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-text-muted">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">0 pins</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">0 lore entries</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
