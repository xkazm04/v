import { Skeleton } from "../skeleton";

export function FilterLayoutSkeleton() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-4 mb-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  );
}

export function FeedHeaderSkeleton() {
  return (
    <div className="mb-6 min-h-[400px]">
           <></>
    </div>
  );
}

export function FeaturedVideosSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturedNewsSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}