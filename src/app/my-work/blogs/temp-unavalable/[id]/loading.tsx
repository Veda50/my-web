export default function BlogDetailLoading() {
  return (
    <div className="min-h-screen bg-[var(--blog-background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button Skeleton */}
        <div className="h-6 w-32 bg-[var(--blog-card)] rounded animate-pulse mb-8" />

        {/* Article Header Skeleton */}
        <header className="mb-8">
          <div className="h-64 md:h-80 bg-[var(--blog-card)] rounded-lg animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-8 bg-[var(--blog-card)] rounded animate-pulse" />
            <div className="h-6 bg-[var(--blog-card)] rounded w-3/4 animate-pulse" />
            <div className="flex gap-6">
              <div className="h-4 w-24 bg-[var(--blog-card)] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[var(--blog-card)] rounded animate-pulse" />
              <div className="h-4 w-20 bg-[var(--blog-card)] rounded animate-pulse" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 w-16 bg-[var(--blog-card)] rounded-full animate-pulse" />
              ))}
            </div>
          </div>
        </header>

        {/* Article Content Skeleton */}
        <div className="bg-[var(--blog-card)] border border-[var(--border)] rounded-lg p-8 mb-8">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded animate-pulse" />
            <div className="h-6 bg-muted rounded w-5/6 animate-pulse" />
            <div className="h-6 bg-muted rounded w-4/5 animate-pulse" />
            <div className="space-y-3 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Share Button Skeleton */}
        <div className="flex justify-center mb-12">
          <div className="h-10 w-32 bg-[var(--blog-card)] rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}
