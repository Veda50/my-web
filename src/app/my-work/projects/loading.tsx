'use client'

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-3" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Stats + Mobile toggle */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-6">
            <div>
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-4 w-28" />
            </div>
            <div>
              <Skeleton className="h-6 w-16 mb-1" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded md:hidden" />
        </div>

        <div className="flex gap-8">
          {/* Sidebar (full height, non-scrollable inner) */}
          <aside className="hidden md:block w-72 shrink-0">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-6">
                  {/* Search */}
                  <Skeleton className="h-10 w-full mb-6" />

                  {/* Tech Stack (tags) */}
                  <Skeleton className="h-5 w-28 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["w-16","w-20","w-24","w-14","w-28","w-16","w-24","w-20","w-14","w-16","w-20","w-24"].map((w, i) => (
                      <Skeleton key={i} className={`h-7 ${w} rounded-full`} />
                    ))}
                  </div>

                  {/* Category */}
                  <Skeleton className="h-5 w-24 mb-3" />
                  <div className="space-y-2 mb-6">
                    {["w-24","w-28","w-20","w-28"].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className={`h-4 ${w}`} />
                      </div>
                    ))}
                  </div>

                  {/* Availability */}
                  <Skeleton className="h-5 w-28 mb-3" />
                  <div className="space-y-2">
                    {["w-32","w-28","w-24"].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4 rounded" />
                        <Skeleton className={`h-4 ${w}`} />
                      </div>
                    ))}
                  </div>

                  {/* Clear filters button */}
                  <Skeleton className="h-9 w-full mt-6" />
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Grid cards */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  {/* Thumbnail */}
                  <Skeleton className="h-48 w-full" />

                  <CardContent className="p-6">
                    {/* Title */}
                    <Skeleton className="h-6 w-3/4 mb-3" />

                    {/* Badges (tags) */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["w-16","w-14","w-20","w-12"].map((w, j) => (
                        <Skeleton key={j} className={`h-6 ${w} rounded`} />
                      ))}
                    </div>

                    {/* Description lines */}
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />

                    {/* Action row (icons/button area) */}
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-9 rounded" />
                      <Skeleton className="h-8 w-9 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pastikan action icons selalu terlihat di device tanpa hover */}
      <style jsx global>{`
        @media (hover: none) {
          .card-actions {
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </div>
  );
}
