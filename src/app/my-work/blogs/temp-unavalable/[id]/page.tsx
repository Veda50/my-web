"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"

interface BlogDetailPageProps {
  params: {
    id: string
  }
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { t } = useLanguage()
  const data = t("blogPage")

  const article = data.articles.find((article: any) => article.id === params.id)

  if (!article) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const relatedArticles = data.articles
    .filter((a: any) => a.id !== article.id && a.category === article.category)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[var(--blog-background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/my-work/blogs"
          className="inline-flex items-center gap-2 text-[var(--blog-primary)] hover:text-[var(--blog-accent)] transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {data.backToBlog}
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            {article.featured && (
              <Badge className="absolute top-4 left-4 bg-[var(--blog-accent)] text-[var(--blog-accent-foreground)]">
                Featured
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--blog-card-foreground)] leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--blog-muted-foreground)]">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>
                  {data.author}: {article.author}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {data.publishedOn} {formatDate(article.publishedAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {article.readTime} {data.readTime}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-[var(--border)] text-[var(--blog-muted-foreground)]"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-[var(--blog-card)] border border-[var(--border)] rounded-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none text-[var(--blog-card-foreground)]">
            <p className="text-xl text-[var(--blog-muted-foreground)] mb-6 leading-relaxed">{article.excerpt}</p>

            <div className="space-y-4 text-[var(--blog-card-foreground)] leading-relaxed">
              {article.content.split("\n").map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div className="flex justify-center mb-12">
          <Button
            variant="outline"
            className="border-[var(--border)] text-[var(--blog-card-foreground)] hover:bg-[var(--blog-primary)] hover:text-[var(--blog-primary-foreground)] bg-transparent"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {data.shareArticle}
          </Button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-[var(--blog-card-foreground)] mb-6">{data.relatedPosts}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle: any) => (
                <Link key={relatedArticle.id} href={`/my-work/blogs/${relatedArticle.id}`} className="group block">
                  <article className="bg-[var(--blog-card)] border border-[var(--border)] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[var(--blog-primary)]">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={relatedArticle.image || "/placeholder.svg"}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[var(--blog-card-foreground)] mb-2 group-hover:text-[var(--blog-primary)] transition-colors duration-300 line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-[var(--blog-muted-foreground)] line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
