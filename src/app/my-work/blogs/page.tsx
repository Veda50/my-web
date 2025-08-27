"use client"

import { useState, useMemo } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Search, Calendar, Clock, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function BlogPage() {
  const { t } = useLanguage()
  const data = t("blogPage")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedFilter, setSelectedFilter] = useState("recent")

  const filteredArticles = useMemo(() => {
    let filtered = data.articles.filter((article: any) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Apply sorting based on filter
    if (selectedFilter === "recent") {
      filtered = filtered.sort(
        (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
    } else if (selectedFilter === "featured") {
      filtered = filtered.filter((article: any) => article.featured)
    }

    return filtered
  }, [data.articles, searchQuery, selectedCategory, selectedFilter])

  const categories = Object.keys(data.categories)
  const filters = Object.keys(data.filters)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-[var(--blog-background)] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--blog-muted-foreground)] h-4 w-4" />
            <Input
              placeholder={data.search.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[var(--blog-card)] border-[var(--border)] text-[var(--blog-card-foreground)]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "secondary"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category
                      ? "bg-[var(--blog-primary)] text-[var(--blog-primary-foreground)]"
                      : "bg-[var(--blog-card)] text-[var(--blog-card-foreground)] hover:bg-[var(--blog-accent)] hover:text-[var(--blog-accent-foreground)]"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {data.categories[category]}
                </Badge>
              ))}
            </div>

            {/* Sort Filters */}
            <div className="flex gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  className={
                    selectedFilter === filter
                      ? "bg-[var(--blog-primary)] text-[var(--blog-primary-foreground)]"
                      : "border-[var(--border)] text-[var(--blog-card-foreground)] hover:bg-[var(--blog-accent)] hover:text-[var(--blog-accent-foreground)]"
                  }
                  onClick={() => setSelectedFilter(filter)}
                >
                  {data.filters[filter]}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--blog-muted-foreground)]">{data.search.noResults}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article: any, index: number) => (
              <Link
                key={article.id}
                href={`/my-work/blogs/${article.id}`}
                className="group block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <article className="bg-[var(--blog-card)] border border-[var(--border)] rounded-lg overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[var(--blog-primary)] stagger-fade-in">
                  {/* Article Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {article.featured && (
                      <Badge className="absolute top-3 left-3 bg-[var(--blog-accent)] text-[var(--blog-accent-foreground)]">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-[var(--blog-muted-foreground)] mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {article.readTime} {data.readTime}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-semibold text-lg text-[var(--blog-card-foreground)] mb-3 group-hover:text-[var(--blog-primary)] transition-colors duration-300 line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-[var(--blog-muted-foreground)] text-sm leading-relaxed mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-[var(--border)] text-[var(--blog-muted-foreground)]"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs border-[var(--border)] text-[var(--blog-muted-foreground)]"
                          >
                            +{article.tags.length - 2}
                          </Badge>
                        )}
                      </div>

                      <ArrowRight className="h-4 w-4 text-[var(--blog-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
