# Loading Patterns Documentation

## Overview

This document describes the standardized loading patterns used across the Genesis application. Consistent loading states improve user experience and reduce perceived wait times.

## Principles

1. **Skeleton Screens Over Spinners**: Use skeleton screens for content that will appear on the page. Use spinners only for small, inline actions (buttons, etc.)

2. **Minimum Duration**: Enforce a minimum loading duration of 300ms to prevent flickering

3. **Structure Matching**: Skeleton structure should match the actual content structure

4. **Consistent Animation**: Use the same pulse animation across all skeletons

## Components

### Base Skeleton Component

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Default (rounded corners)
<Skeleton className="h-4 w-full" />

// Text variant (sharper corners)
<Skeleton variant="text" className="h-4 w-3/4" />

// Circular variant (avatars, icons)
<Skeleton variant="circular" className="w-10 h-10" />

// Rounded variant (buttons, cards)
<Skeleton variant="rounded" className="w-8 h-8" />
```

### Pre-built Skeletons

#### SkeletonCard

For loading card components (world cards, gallery items, etc.)

```tsx
import { SkeletonCard } from "@/components/ui/skeleton";

// Basic card
<SkeletonCard />

// With avatar
<SkeletonCard showAvatar />

// Custom number of description lines
<SkeletonCard lines={2} />
```

#### SkeletonGrid

For loading grid layouts (worlds list, gallery grid)

```tsx
import { SkeletonGrid } from "@/components/ui/skeleton";

<SkeletonGrid
  items={6}
  columns={{ sm: 1, md: 2, lg: 3 }}
/>
```

#### SkeletonList

For loading list items (pins, worlds in list view)

```tsx
import { SkeletonList } from "@/components/ui/skeleton";

<SkeletonList
  items={5}
  showAvatar
/>
```

#### SkeletonText

For loading text content

```tsx
import { SkeletonText } from "@/components/ui/skeleton";

<SkeletonText lines={3} />
```

#### SkeletonSpinner

For small, inline loading states (buttons, upload zones)

```tsx
import { SkeletonSpinner } from "@/components/ui/skeleton";

// Small (buttons)
<SkeletonSpinner size="sm" />

// Medium (default)
<SkeletonSpinner size="md" />

// Large (main content area)
<SkeletonSpinner size="lg" />
```

#### SkeletonPin

For loading pin markers

```tsx
import { SkeletonPin } from "@/components/ui/skeleton";

<SkeletonPin showIcon showTitle showDescription />
```

## Hooks

### useLoadingState

Manages loading state with minimum duration enforcement

```tsx
import { useLoadingState } from "@/hooks/use-loading-state";

const { isLoading, startLoading, stopLoading } = useLoadingState({
  minDuration: 300, // Prevents flicker
  maxDuration: 10000, // Optional timeout
});

const fetchData = async () => {
  startLoading();
  try {
    const data = await api.fetch();
    setData(data);
  } finally {
    stopLoading();
  }
};
```

### useAsyncOperation

Simplified hook for async operations with automatic loading state

```tsx
import { useAsyncOperation } from "@/hooks/use-loading-state";

const { data, isLoading, error, execute } = useAsyncOperation(
  async () => {
    const response = await fetch("/api/data");
    return response.json();
  },
  { minDuration: 300 }
);

// Call execute to run the operation
useEffect(() => {
  execute();
}, []);

// Render based on state
if (isLoading) return <SkeletonGrid />;
if (error) return <ErrorMessage>{error.message}</ErrorMessage>;
if (data) return <DataDisplay data={data} />;
```

## Usage Examples

### Worlds List Page

```tsx
import { SkeletonGrid } from "@/components/ui/skeleton";

export default function WorldsPage() {
  const { worlds, loading, error } = useMyWorlds();

  return (
    <div>
      {loading ? (
        <SkeletonGrid items={6} columns={{ sm: 1, md: 2, lg: 3 }} />
      ) : error ? (
        <ErrorState />
      ) : worlds.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worlds.map((world) => (
            <WorldCard key={world.id} {...world} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Image Gallery

```tsx
import { SkeletonSpinner } from "@/components/ui/skeleton";

export function ImageGallery() {
  const { images, isLoading } = useGallery();

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <SkeletonSpinner size="lg" />
            <p className="text-text-secondary text-sm">Loading images...</p>
          </div>
        </div>
      ) : (
        <ImageGrid images={images} />
      )}
    </div>
  );
}
```

### Button Loading State

```tsx
import { SkeletonSpinner } from "@/components/ui/skeleton";

export function UploadButton({ isUploading, onUpload }) {
  return (
    <button onClick={onUpload} disabled={isUploading}>
      {isUploading ? (
        <>
          <SkeletonSpinner size="sm" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="w-4 h-4" />
          Upload
        </>
      )}
    </button>
  );
}
```

## Best Practices

### DO:
- Use skeleton screens for page-level content
- Match skeleton structure to actual content
- Enforce minimum duration (300ms) to prevent flicker
- Use consistent animation (pulse)
- Provide loading feedback for all async operations

### DON'T:
- Use spinners for large content areas (use skeletons instead)
- Show loading for less than 100ms (too fast, causes flicker)
- Mix different loading patterns arbitrarily
- Forget to handle error states
- Leave loading states visible indefinitely (add timeouts)

## Migration Guide

### Before (Spinner)

```tsx
{loading ? (
  <div className="flex items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
) : (
  <WorldsList worlds={worlds} />
)}
```

### After (Skeleton)

```tsx
import { SkeletonGrid } from "@/components/ui/skeleton";

{loading ? (
  <SkeletonGrid items={6} columns={{ sm: 1, md: 2, lg: 3 }} />
) : (
  <WorldsList worlds={worlds} />
)}
```

## Performance Considerations

1. **Minimize Re-renders**: Skeleton components are static and won't cause unnecessary re-renders

2. **CSS Animation**: Using CSS `animate-pulse` is more performant than JS-based animations

3. **Minimal DOM**: Skeleton components have simple DOM structure, reducing render time

4. **No Data Fetching**: Skeletons are pure UI components, no data fetching until content loads

## Testing

When testing loading states:

1. Test with slow network (Chrome DevTools > Network > Slow 3G)
2. Verify minimum duration enforcement
3. Check that skeletons match actual content structure
4. Ensure error states are handled
5. Verify loading states clear properly

## Related Files

- `src/components/ui/skeleton/` - Skeleton components
- `src/hooks/use-loading-state.ts` - Loading state hooks
- `src/components/world/ui/sidebar-skeleton.tsx` - Complex skeleton example
- `src/components/world/ui/map-skeleton.tsx` - Map-specific skeleton
