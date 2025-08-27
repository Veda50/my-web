"use client";

import { useMemo, useState } from "react";
import projectsData from "@/data/en/projectsPage.json";
import { ProjectsFiltersSidebar } from "@/components/projectPage/FiltersSidebar";
import { ProjectCard } from "@/components/projectPage/ProjectCard";

type ProjectStatus = "prod" | "dev" | "arch" | "priv";
export type ProjectItem = {
  title: string;
  description: string;
  imageSrc?: string;
  tags: string[];
  liveDemoUrl?: string | null;
  sourceCodeUrl?: string | null;
  status: ProjectStatus;
};

type Filters = {
  statuses: ProjectStatus[]; // default sama seperti versi lama
  tags: string[];
  hasDemo: boolean;
  hasRepo: boolean;
};

function useProjects() {
  const list = projectsData.projects as ProjectItem[];

  const statuses = useMemo<ProjectStatus[]>(
    () => Array.from(new Set(list.map((p) => p.status))) as ProjectStatus[],
    [list]
  );

  const tags = useMemo(() => {
    const counts = list.reduce<Record<string, number>>((acc, p) => {
      for (const tag of p.tags) acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).sort((a, b) => {
      const diff = counts[b] - counts[a];
      return diff !== 0 ? diff : a.localeCompare(b);
    });
  }, [list]);

  return { list, statuses, tags };
}

export default function ProjectsPage() {
  const { list, statuses, tags } = useProjects();
  const ui = projectsData;

  const [filters, setFilters] = useState<Filters>({
    statuses: ["prod", "dev", "arch"],
    tags: [],
    hasDemo: false,
    hasRepo: false,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filtered = useMemo(() => {
    return list.filter((p) => {
      const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(p.status);
      const tagMatch = filters.tags.length === 0 || p.tags.some((t) => filters.tags.includes(t));
      const demoMatch = !filters.hasDemo || Boolean(p.liveDemoUrl);
      const repoMatch = !filters.hasRepo || Boolean(p.sourceCodeUrl);
      return statusMatch && tagMatch && demoMatch && repoMatch;
    });
  }, [list, filters]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{ui.title}</h1>
          <p className="text-muted-foreground">{ui.subtitle}</p>
        </div>

        {/* Stats + Mobile toggle */}
        <div className="flex items-center justify-between mb-8 p-4 rounded-lg bg-muted/30">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{list.length}</strong> {ui.stats.totalProjects}
            </span>
            <span>
              <strong className="text-foreground">{tags.length}</strong> {ui.stats.technologies}
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen((v) => !v)}
            className="md:hidden bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm px-3 py-2 rounded"
          >
            {ui.filters.button}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar (full-height, no inner scroll) */}
          <ProjectsFiltersSidebar
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            filters={filters}
            onChange={setFilters}
            statuses={statuses}
            tags={tags}
            ui={ui}
          />

          {/* Backdrop (mobile) */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* Grid */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p, idx) => (
                  <ProjectCard key={`${p.title}-${idx}`} project={p} ui={ui} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-1">{ui.noResults.title}</h3>
                <p className="text-muted-foreground">{ui.noResults.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Show action icons always on touch devices (no-hover) */}
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
