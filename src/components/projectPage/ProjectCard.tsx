"use client";

import Image from "next/image";
import { Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type ProjectItem } from "@/app/my-work/projects/page";
import Link from "next/link";

type Props = {
  project: ProjectItem;
  ui: any; // projects.en.json root object
};

const STATUS_BADGE_CLASS = {
  prod: "bg-emerald-600 text-white",
  dev: "bg-amber-500 text-white",
  arch: "bg-slate-500 text-white",
  priv: "bg-rose-600 text-white",
} as const;

const statusKeyToCategoryKey = (st: ProjectItem["status"]) =>
  st === "prod" ? "production" : st === "dev" ? "development" : st === "arch" ? "archived" : "private";

export function ProjectCard({ project: p, ui }: Props) {
  const categoryLabel = ui.categories[statusKeyToCategoryKey(p.status)];
  const isPrivate = p.status === "priv";

  return (
    <article
      className="group relative flex flex-col bg-card rounded-lg overflow-hidden shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
    >
      {/* Media */}
      <div className="relative h-48">
        <Image
          src={p.imageSrc || "/img/none.png"}
          alt={p.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
        />
        <div className="absolute top-4 right-4">
          <Badge className={STATUS_BADGE_CLASS[p.status]}>{categoryLabel}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col gap-4">
        <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{p.title}</h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="text-xs capitalize px-2 py-1 rounded-full border border-border text-foreground"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Description (min-height agar tinggi kartu konsisten) */}
        <p className="text-muted-foreground text-sm line-clamp-3 min-h-[60px]">
          {p.description}
        </p>
      </div>

      {/* Actions: icons melayang kanan-bawah, muncul saat hover */}
      {!isPrivate && (p.liveDemoUrl || p.sourceCodeUrl) && (
        <div
          className="
            card-actions
            absolute bottom-4 right-4 flex gap-2
            opacity-0 group-hover:opacity-100
            translate-y-2 group-hover:translate-y-0
            transition-all
          "
        >
          {p.sourceCodeUrl && (
            <Link
              href={p.sourceCodeUrl}
              target="_blank"
              aria-label={ui.projectCard.viewGithub}
              className="rounded-full p-2 bg-slate-800/90 dark:bg-slate-200/90 text-slate-200/90 dark:text-slate-800 shadow ring-1 ring-black/5 hover:scale-105"
            >
              <Github className="w-4 h-4" />
            </Link>
          )}
          {p.liveDemoUrl && (
            <Link
              href={p.liveDemoUrl}
              target="_blank"
              aria-label={ui.projectCard.viewLive}
              className="rounded-full p-2 bg-blue-600 text-white shadow hover:bg-blue-700"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </article>
  );
}
