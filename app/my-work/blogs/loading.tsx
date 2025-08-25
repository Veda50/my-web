export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[var(--blog-background)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filters Skeleton */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-md mx-auto">
            <div className="h-10 bg-[var(--blog-card)] rounded-md animate-pulse" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-[var(--blog-card)] rounded-full animate-pulse" />
              ))}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-20 bg-[var(--blog-card)] rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-[var(--blog-card)] border border-[var(--border)] rounded-lg overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <div className="p-6 space-y-4">
                <div className="flex gap-4">
                  <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-5 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded animate-pulse" />
                  <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="h-5 w-12 bg-muted rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
