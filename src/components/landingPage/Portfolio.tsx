"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Portfolio() {
  const { language } = useLanguage()
  const data = language === "en" ? enLanding.portfolio : idLanding.portfolio

  const router = useRouter();

  return (
    <section
      id="portfolio"
      className="
        py-16 px-6
        bg-white dark:bg-slate-900
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
            {data.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project: any, index: number) => {
            const hasLive = Boolean(
              project.liveUrl || project.live || project.liveDemoUrl
            );
            const hasGit = Boolean(
              project.githubUrl || project.github || project.sourceCodeUrl
            );

            const liveHref =
              project.liveUrl || project.live || project.liveDemoUrl || "#";
            const gitHref =
              project.githubUrl ||
              project.github ||
              project.sourceCodeUrl ||
              "#";

            return (
              <Card
                key={index}
                className="
                  group overflow-hidden
                  bg-card text-card-foreground border-border
                  hover:shadow-xl hover:-translate-y-2
                  transition-all duration-300
                "
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <div className="relative w-full h-48">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                  </div>

                  {/* Overlay actions */}
                  {(hasLive || hasGit) && (
                    <div
                      className="
                        absolute inset-0
                        bg-black/0 group-hover:bg-black/30
                        transition-colors duration-300
                        flex items-center justify-center
                      "
                    >
                      <div
                        className="
                          opacity-0 group-hover:opacity-100
                          translate-y-2 group-hover:translate-y-0
                          transition-all duration-300
                          flex gap-3
                        "
                      >
                        {hasLive && (
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            asChild
                          >
                            <a
                              href={liveHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Live Demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {hasGit && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-background/90 text-foreground border-border hover:bg-background"
                            asChild
                          >
                            <a
                              href={gitHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="GitHub Repo"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <CardContent className="p-6">
                  {project.category && (
                    <Badge
                      variant="secondary"
                      className="
                        mb-3
                        bg-blue-100 text-blue-700
                        dark:bg-blue-900/30 dark:text-blue-300
                      "
                    >
                      {project.category}
                    </Badge>
                  )}

                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            className="
              border-border text-foreground bg-transparent
              hover:bg-muted/40 
            "
            onClick={() => router.push('/my-work/projects')}
          >
              {language === "id" ? "Lihat Semua Proyek" : "View All Projects"}
              <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
