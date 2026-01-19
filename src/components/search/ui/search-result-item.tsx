import React, { useCallback } from "react";
import { MapPin, BookOpen } from "lucide-react";
import { SearchHighlight } from "./search-highlight";
import type { SearchResultItem as SearchResultItemType } from "@/lib/search-types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SearchResultItemProps {
  result: SearchResultItemType;
  query: string;
  onClick: (result: SearchResultItemType) => void;
}

export function SearchResultItem({ result, query, onClick }: SearchResultItemProps) {
  const handleClick = useCallback(() => {
    onClick(result);
  }, [result, onClick]);

  const isPin = result.type === "pin";

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className="w-full justify-start px-4 py-3 text-left hover:bg-background-card-hover focus:bg-background-card-hover rounded-none"
    >
      <div className="flex items-start gap-3 w-full">
        {/* Icon */}
        <ResultIcon isPin={isPin} />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <ResultTitle result={result} query={query} isPin={isPin} />
          <ResultMetadata result={result} isPin={isPin} />
        </div>
      </div>
    </Button>
  );
}

interface ResultIconProps {
  isPin: boolean;
}

function ResultIcon({ isPin }: ResultIconProps) {
  return (
    <div
      className={cn(
        "mt-0.5 flex-shrink-0",
        isPin ? "text-accent-gold" : "text-text-muted"
      )}
    >
      {isPin ? <MapPin className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
    </div>
  );
}

interface ResultTitleProps {
  result: SearchResultItemType;
  query: string;
  isPin: boolean;
}

function ResultTitle({ result, query, isPin }: ResultTitleProps) {
  return (
    <>
      <div className="text-sm font-medium text-text-primary">
        <SearchHighlight text={result.title} query={query} />
      </div>

      {isPin && result.description && (
        <p className="text-xs text-text-secondary line-clamp-2">
          <SearchHighlight text={result.description} query={query} />
        </p>
      )}

      {!isPin && (
        <p className="text-xs text-text-secondary line-clamp-2">
          <SearchHighlight text={result.content} query={query} />
        </p>
      )}
    </>
  );
}

interface ResultMetadataProps {
  result: SearchResultItemType;
  isPin: boolean;
}

function ResultMetadata({ result, isPin }: ResultMetadataProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      {isPin && (result as any).layerName && (
        <Badge variant="outline" className="px-1.5 py-0.5">
          {(result as any).layerName}
        </Badge>
      )}

      {isPin && (
        <Badge variant="outline" className="px-1.5 py-0.5 capitalize">
          {(result as any).pinType}
        </Badge>
      )}

      {!isPin && (
        <Badge variant="outline" className="px-1.5 py-0.5 capitalize">
          {(result as any).category}
        </Badge>
      )}

      <span className="ml-auto text-accent-gold">
        {Math.round(result.relevance)}% match
      </span>
    </div>
  );
}
