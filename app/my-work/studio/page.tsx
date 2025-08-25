"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Search, ExternalLink, Code, Palette, Github, Notebook, Cloud, Zap } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const iconMap = {
  code: Code,
  palette: Palette,
  github: Github,
  notebook: Notebook,
  cloud: Cloud,
  api: Zap,
}

export default function StudioPage() {
  const { t } = useLanguage()
  const data = t("studioPage")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTools = useMemo(() => {
    return data.tools.filter((tool: any) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [data.tools, searchQuery, selectedCategory])

  const categories = Object.keys(data.categories)
  const uniqueCategories = [...new Set(data.tools.map((tool: any) => tool.category))]

  return (
    <div className="min-h-screen bg-[var(--studio-background)] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--studio-card-foreground)] mb-4">
            {data.header.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {data.header.subtitle}
          </p>
        </div>

        {/* Search and Stats Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={data.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--studio-card)] border-[var(--studio-border)]"
            />
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>
              {data.stats.totalTools}: {data.tools.length}
            </span>
            <span>
              {data.stats.categories}: {uniqueCategories.length}
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "secondary"}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedCategory === category
                  ? "bg-[var(--studio-primary)] text-[var(--studio-primary-foreground)]"
                  : "bg-[var(--studio-card)] text-[var(--studio-card-foreground)] hover:bg-[var(--studio-accent)] hover:text-[var(--studio-accent-foreground)]"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {data.categories[category]}
            </Badge>
          ))}
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{data.search.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool: any, index: number) => {
              const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Code

              return (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-[var(--studio-card)] border border-[var(--studio-border)] rounded-lg p-6 h-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[var(--studio-primary)] stagger-fade-in">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="p-3 rounded-lg transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                      >
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <h3 className="font-semibold text-[var(--studio-card-foreground)] mb-2 group-hover:text-[var(--studio-primary)] transition-colors duration-300">
                      {tool.name}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>

                    <div className="mt-4">
                      <Badge
                        variant="outline"
                        className="text-xs border-[var(--studio-border)] text-[var(--studio-card-foreground)]"
                      >
                        {data.categories[tool.category]}
                      </Badge>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
