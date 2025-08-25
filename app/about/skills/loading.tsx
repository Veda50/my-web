export default function Loading() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-12">
          {Array.from({ length: 6 }).map((_, categoryIndex) => (
            <section key={categoryIndex} className="animate-pulse">
              <div className="mb-8">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {Array.from({ length: 8 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4 h-24"></div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
