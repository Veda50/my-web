"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MessageSquare, Eye, Clock, TrendingUp, Filter, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import NewThreadModal from "@/components/NewThreadModal"

// Mock data for threads
const initialMockThreads = [
  {
    id: "1",
    title: "Feature Request: Dark Mode Toggle in Navigation",
    content: "It would be great to have a quick dark mode toggle in the main navigation...",
    author: {
      name: "Sarah Chen",
      avatar: "/professional-woman-headshot.png",
      initials: "SC",
    },
    category: "features",
    replies: 12,
    views: 234,
    likes: 8,
    createdAt: "2024-01-15T10:30:00Z",
    lastActivity: "2024-01-16T14:20:00Z",
    isPopular: true,
  },
  {
    id: "2",
    title: "Bug Report: Mobile Navigation Menu Not Closing",
    content: "On mobile devices, the navigation menu doesn't close after selecting a link...",
    author: {
      name: "Alex Rodriguez",
      avatar: "/professional-man-headshot.png",
      initials: "AR",
    },
    category: "bugs",
    replies: 5,
    views: 89,
    likes: 3,
    createdAt: "2024-01-14T16:45:00Z",
    lastActivity: "2024-01-15T09:15:00Z",
    isPopular: false,
  },
  {
    id: "3",
    title: "General Discussion: Best Practices for Portfolio Design",
    content: "What are your thoughts on the current portfolio layout? Any suggestions for improvement?",
    author: {
      name: "Maria Santos",
      avatar: "/creative-designer-headshot.png",
      initials: "MS",
    },
    category: "general",
    replies: 18,
    views: 456,
    likes: 15,
    createdAt: "2024-01-13T08:20:00Z",
    lastActivity: "2024-01-16T11:30:00Z",
    isPopular: true,
  },
  {
    id: "4",
    title: "Feedback: Love the New Animation Effects!",
    content: "The recent updates to the page animations are fantastic. Really smooth and professional.",
    author: {
      name: "David Kim",
      avatar: null,
      initials: "DK",
    },
    category: "feedback",
    replies: 7,
    views: 123,
    likes: 12,
    createdAt: "2024-01-12T14:10:00Z",
    lastActivity: "2024-01-14T16:45:00Z",
    isPopular: false,
  },
]

const categoryColors = {
  feedback: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  bugs: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  features: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export default function FeedbackPage() {
  const { t } = useLanguage()
  const feedbackData = t("feedbackPage")

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("latest")
  const [threads, setThreads] = useState(initialMockThreads)

  const handleThreadCreated = (newThread: any) => {
    setThreads((prev) => [newThread, ...prev])
  }

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || thread.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes + b.replies - (a.likes + a.replies)
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default: // latest
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    }
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">{feedbackData.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animate-delay-200">
            {feedbackData.subtitle}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-in-up animate-delay-400">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={feedbackData.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  {feedbackData.categories[selectedCategory]}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(feedbackData.categories).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => setSelectedCategory(key)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[120px] bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  {feedbackData.sortOptions[sortBy]}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.entries(feedbackData.sortOptions).map(([key, label]) => (
                  <DropdownMenuItem key={key} onClick={() => setSortBy(key)}>
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NewThreadModal onThreadCreated={handleThreadCreated} />
          </div>
        </div>

        {/* Thread List */}
        <div className="space-y-4">
          {sortedThreads.length === 0 ? (
            <Card className="text-center py-12 animate-fade-in-up">
              <CardContent>
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feedbackData.emptyState.title}</h3>
                <p className="text-muted-foreground mb-4">{feedbackData.emptyState.description}</p>
                <NewThreadModal onThreadCreated={handleThreadCreated} />
              </CardContent>
            </Card>
          ) : (
            sortedThreads.map((thread, index) => (
              <Card
                key={thread.id}
                className="card-hover-lift cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/feedback/${thread.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={categoryColors[thread.category]}>
                            {feedbackData.categories[thread.category]}
                          </Badge>
                          {thread.isPopular && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            >
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-card-foreground hover:text-primary transition-colors">
                          {thread.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{thread.content}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={thread.author.avatar || "/placeholder.svg"} alt={thread.author.name} />
                            <AvatarFallback className="text-xs">{thread.author.initials}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{thread.author.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>
                            {thread.replies} {feedbackData.threadStats.replies}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>
                            {thread.views} {feedbackData.threadStats.views}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatTimeAgo(thread.lastActivity)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
