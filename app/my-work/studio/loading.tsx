export default function StudioLoading() {
  return (
    <div className="min-h-screen bg-[var(--studio-background)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar Skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <div className="h-10 bg-[var(--studio-card)] rounded-md animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="h-4 w-20 bg-[var(--studio-card)] rounded animate-pulse" />
            <div className="h-4 w-24 bg-[var(--studio-card)] rounded animate-pulse" />
          </div>
        </div>

        {/* Category Filters Skeleton */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-16 bg-[var(--studio-card)] rounded-full animate-pulse" />
          ))}
        </div>

        {/* Tools Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[var(--studio-card)] border border-[var(--studio-border)] rounded-lg p-6 h-48">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
                <div className="w-4 h-4 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-5 bg-muted rounded mb-2 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
              <div className="mt-4">
                <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
