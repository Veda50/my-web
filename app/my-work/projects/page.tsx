"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, ExternalLink, Search, Filter, X, Menu } from "lucide-react"
import Image from "next/image"

// Mock project data - replace with your actual projects
const mockProjects = [
  {
    id: "1",
    title: {
      en: "E-Commerce Platform",
      id: "Platform E-Commerce",
    },
    description: {
      en: "A full-stack e-commerce solution with modern UI/UX, payment integration, and admin dashboard.",
      id: "Solusi e-commerce full-stack dengan UI/UX modern, integrasi pembayaran, dan dashboard admin.",
    },
    image: "/modern-ecommerce-interface.png",
    techStack: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Stripe", "PostgreSQL"],
    category: "production",
    urls: {
      github: "https://github.com/username/ecommerce",
      live: "https://ecommerce-demo.vercel.app",
    },
  },
  {
    id: "2",
    title: {
      en: "Mobile Banking App",
      id: "Aplikasi Mobile Banking",
    },
    description: {
      en: "Secure mobile banking application with biometric authentication and real-time transactions.",
      id: "Aplikasi mobile banking aman dengan autentikasi biometrik dan transaksi real-time.",
    },
    image: "/mobile-banking-app.png",
    techStack: ["React Native", "TypeScript", "Node.js", "MongoDB", "JWT"],
    category: "development",
    urls: {
      github: "https://github.com/username/banking-app",
      live: null,
    },
  },
  {
    id: "3",
    title: {
      en: "Analytics Dashboard",
      id: "Dashboard Analitik",
    },
    description: {
      en: "Real-time analytics dashboard with interactive charts and data visualization.",
      id: "Dashboard analitik real-time dengan grafik interaktif dan visualisasi data.",
    },
    image: "/modern-dashboard.png",
    techStack: ["Vue.js", "D3.js", "Python", "FastAPI", "Redis"],
    category: "production",
    urls: {
      github: "https://github.com/username/analytics",
      live: "https://analytics-demo.vercel.app",
    },
  },
  {
    id: "4",
    title: {
      en: "Restaurant Website",
      id: "Website Restoran",
    },
    description: {
      en: "Elegant restaurant website with online reservation system and menu management.",
      id: "Website restoran elegan dengan sistem reservasi online dan manajemen menu.",
    },
    image: "/elegant-restaurant-website.png",
    techStack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    category: "archived",
    urls: {
      github: null,
      live: "https://restaurant-demo.com",
    },
  },
  {
    id: "5",
    title: {
      en: "Fitness Tracking App",
      id: "Aplikasi Pelacak Kebugaran",
    },
    description: {
      en: "Comprehensive fitness tracking application with workout plans and progress monitoring.",
      id: "Aplikasi pelacak kebugaran komprehensif dengan rencana latihan dan pemantauan progres.",
    },
    image: "/fitness-app-interface.png",
    techStack: ["Flutter", "Dart", "Firebase", "SQLite"],
    category: "private",
    urls: {
      github: null,
      live: null,
    },
  },
]

export default function ProjectsPage() {
  const { t, language } = useLanguage()
  const data = t("projectsPage")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const allTechStack = useMemo(() => {
    const techSet = new Set<string>()
    mockProjects.forEach((project) => {
      project.techStack.forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [])

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchesSearch =
        project.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTechStack =
        selectedTechStack.length === 0 || selectedTechStack.some((tech) => project.techStack.includes(tech))

      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(project.category)

      const matchesAvailability =
        selectedAvailability.length === 0 ||
        selectedAvailability.some((availability) => {
          if (availability === "github") return project.urls.github !== null
          if (availability === "live") return project.urls.live !== null
          if (availability === "both") return project.urls.github !== null && project.urls.live !== null
          return true
        })

      return matchesSearch && matchesTechStack && matchesCategory && matchesAvailability
    })
  }, [searchTerm, selectedTechStack, selectedCategories, selectedAvailability, language])

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedTechStack([])
    setSelectedCategories([])
    setSelectedAvailability([])
  }

  const hasActiveFilters =
    searchTerm || selectedTechStack.length > 0 || selectedCategories.length > 0 || selectedAvailability.length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>
              <strong className="text-foreground">{mockProjects.length}</strong> {data.stats.totalProjects}
            </span>
            <span>
              <strong className="text-foreground">{allTechStack.length}</strong> {data.stats.technologies}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="md:hidden bg-transparent"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Menu className="w-4 h-4 mr-2" />
            {data.filters.title || "Filters"}
          </Button>
        </div>

        <div className="flex gap-8">
          <div
            className={`
            ${isMobileFilterOpen ? "block" : "hidden"} md:block
            fixed md:relative top-0 left-0 z-50 md:z-auto
            w-80 md:w-72 h-full md:h-auto
            bg-background md:bg-transparent
            border-r md:border-r-0 border-border
            p-6 md:p-0
            overflow-y-auto
          `}
          >
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h3 className="font-semibold">{data.filters.title || "Filters"}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Card className="sticky top-0">
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={data.filters.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      {data.filters.techStack}
                    </h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allTechStack.map((tech) => (
                        <div key={tech} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tech-${tech}`}
                            checked={selectedTechStack.includes(tech)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTechStack([...selectedTechStack, tech])
                              } else {
                                setSelectedTechStack(selectedTechStack.filter((t) => t !== tech))
                              }
                            }}
                          />
                          <label
                            htmlFor={`tech-${tech}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {tech}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">{data.filters.category}</h3>
                    <div className="space-y-2">
                      {Object.entries(data.categories).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${key}`}
                            checked={selectedCategories.includes(key)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, key])
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== key))
                              }
                            }}
                          />
                          <label
                            htmlFor={`category-${key}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">{data.filters.availability}</h3>
                    <div className="space-y-2">
                      {Object.entries(data.availability).map(([key, label]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`availability-${key}`}
                            checked={selectedAvailability.includes(key)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAvailability([...selectedAvailability, key])
                              } else {
                                setSelectedAvailability(selectedAvailability.filter((a) => a !== key))
                              }
                            }}
                          />
                          <label
                            htmlFor={`availability-${key}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearAllFilters}
                      className="w-full flex items-center gap-2 bg-transparent"
                    >
                      <X className="w-4 h-4" />
                      {data.filters.clearFilters}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {isMobileFilterOpen && (
            <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileFilterOpen(false)} />
          )}

          <div className="flex-1">
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                  <Card
                    key={project.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 stagger-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative h-48 overflow-hidden rounded-t-lg">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title[language]}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="capitalize">
                          {data.categories[project.category as keyof typeof data.categories]}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                        {project.title[language]}
                      </h3>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {project.techStack.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 mb-4">
                        {project.urls.github && (
                          <Button variant="outline" size="sm" className="p-2 bg-transparent hover:bg-muted" asChild>
                            <a
                              href={project.urls.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View on GitHub"
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                        {project.urls.live && (
                          <Button size="sm" className="p-2" asChild>
                            <a
                              href={project.urls.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View Live Demo"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>

                      <p className="text-muted-foreground text-sm line-clamp-3">{project.description[language]}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">{data.noResults.title}</h3>
                  <p className="text-muted-foreground">{data.noResults.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
