"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Filter as FilterIcon } from "lucide-react";
import { type ProjectItem } from "@/app/my-work/projects/page";

type ProjectStatus = "prod" | "dev" | "arch" | "priv";

type Props = {
  open: boolean;
  onClose: () => void;
  filters: {
    statuses: ProjectStatus[];
    tags: string[];
    hasDemo: boolean;
    hasRepo: boolean;
  };
  onChange: (next: Props["filters"]) => void;
  statuses: ProjectStatus[];
  tags: string[];
  ui: any; // projects.en.json root object
};

const statusKeyToCategoryKey = (st: ProjectStatus) =>
  st === "prod" ? "production" : st === "dev" ? "development" : st === "arch" ? "archived" : "private";

export function ProjectsFiltersSidebar({
  open,
  onClose,
  filters,
  onChange,
  statuses,
  tags,
  ui,
}: Props) {
  const toggleArr = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const clearAll = () => onChange({ statuses: [], tags: [], hasDemo: false, hasRepo: false });

  const hasActive =
    filters.statuses.length > 0 || filters.tags.length > 0 || filters.hasDemo || filters.hasRepo;

  return (
    <aside
      className={`
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        fixed md:relative top-0 left-0 z-50 md:z-auto
        w-80 md:w-72
        /* ⬇️ penting: drawer mobile full viewport + bisa scroll */
        h-[100dvh] md:h-auto
        overflow-y-auto md:overflow-visible
        overscroll-contain
        bg-background md:bg-transparent
        border-r md:border-r-0 border-border
        p-6 transition-transform duration-300
      `}
    >
      {/* Header mobile */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h3 className="font-semibold">{ui.filters.all}</h3>
        <button onClick={onClose} className="p-2" aria-label="Close filters">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Card container */}
      <Card className="md:sticky md:top-24">
        <CardContent className="p-6 space-y-8">
          {/* Status */}
          <section>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FilterIcon className="w-4 h-4" />
              {ui.filters.category}
            </h4>
            <div className="space-y-2">
              {statuses.map((st) => {
                const label = ui.categories[statusKeyToCategoryKey(st)];
                return (
                  <label key={st} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      id={`status-${st}`}
                      checked={filters.statuses.includes(st)}
                      onCheckedChange={(c) => {
                        const next = c
                          ? ([...filters.statuses, st] as ProjectStatus[])
                          : (filters.statuses.filter((x) => x !== st) as ProjectStatus[]);
                        onChange({ ...filters, statuses: next });
                      }}
                    />
                    <span className="text-sm capitalize">{label}</span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Availability */}
          <section>
            <h4 className="font-semibold mb-3">{ui.filters.availability}</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="availability-live"
                  checked={filters.hasDemo}
                  onCheckedChange={() => onChange({ ...filters, hasDemo: !filters.hasDemo })}
                />
                <span className="text-sm">{ui.availability.live}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="availability-repo"
                  checked={filters.hasRepo}
                  onCheckedChange={() => onChange({ ...filters, hasRepo: !filters.hasRepo })}
                />
                <span className="text-sm">{ui.availability.github}</span>
              </label>
            </div>
          </section>

          {/* Tags */}
          <section>
            <h4 className="font-semibold mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const active = filters.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => onChange({ ...filters, tags: toggleArr(filters.tags, tag) })}
                    className={`
                      px-3 py-1 rounded-full text-xs capitalize border
                      ${active ? "bg-blue-600 text-white border-blue-600" : "bg-transparent text-foreground border-border"}
                    `}
                    aria-pressed={active}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </section>

          {hasActive && (
            <button
              onClick={clearAll}
              className="w-full text-sm border rounded px-3 py-2 bg-transparent hover:bg-muted transition"
            >
              {ui.filters.clearFilters}
            </button>
          )}
        </CardContent>
      </Card>
    </aside>
  );
}
