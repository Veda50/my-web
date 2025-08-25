export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-slate-200 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-slate-200 rounded-lg w-2/3 mx-auto animate-pulse"></div>
        </div>

        {/* Filter skeleton */}
        <div className="flex justify-between items-center mb-12">
          <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded w-48 animate-pulse"></div>
        </div>

        {/* Timeline skeleton */}
        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-slate-200"></div>

          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative">
                <div className="absolute left-8 w-4 h-4 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="ml-20 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="h-6 bg-slate-200 rounded w-32 animate-pulse"></div>
                      <div className="h-6 bg-slate-200 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="h-8 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
