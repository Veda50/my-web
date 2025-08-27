"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  Heart,
  Share2,
  MoreHorizontal,
  ThumbsUp,
  Reply,
  Flag,
  Edit,
  Trash2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for the thread and replies
const mockThread = {
  id: "1",
  title: "Feature Request: Dark Mode Toggle in Navigation",
  content: `It would be great to have a quick dark mode toggle in the main navigation bar. Currently, users have to go through the settings menu to change themes, which isn't very convenient.

Here are some benefits I see:
- Better user experience with quick access
- More modern interface design
- Follows current web design trends
- Could increase user engagement

I've seen this implemented well on sites like GitHub and Discord. What do you think about adding this feature?`,
  author: {
    name: "Sarah Chen",
    avatar: "/professional-woman-headshot.png",
    initials: "SC",
    role: "Community Member",
  },
  category: "features",
  replies: 12,
  views: 234,
  likes: 8,
  createdAt: "2024-01-15T10:30:00Z",
  lastActivity: "2024-01-16T14:20:00Z",
  isLiked: false,
}

const initialMockReplies = [
  {
    id: "r1",
    content:
      "Great suggestion! I've been thinking about this too. A toggle in the header would be much more accessible.",
    author: {
      name: "Alex Rodriguez",
      avatar: "/professional-man-headshot.png",
      initials: "AR",
      role: "Developer",
    },
    createdAt: "2024-01-15T14:20:00Z",
    likes: 5,
    isLiked: true,
  },
  {
    id: "r2",
    content:
      "I agree with this feature request. Maybe we could also add a system preference option that automatically switches based on the user's OS theme setting?",
    author: {
      name: "Maria Santos",
      avatar: "/creative-designer-headshot.png",
      initials: "MS",
      role: "Designer",
    },
    createdAt: "2024-01-15T16:45:00Z",
    likes: 3,
    isLiked: false,
  },
  {
    id: "r3",
    content:
      "This would definitely improve the UX. I find myself switching themes frequently depending on the time of day, so having quick access would be perfect.",
    author: {
      name: "David Kim",
      avatar: null,
      initials: "DK",
      role: "Community Member",
    },
    createdAt: "2024-01-16T09:15:00Z",
    likes: 2,
    isLiked: false,
  },
]

const categoryColors = {
  feedback: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  bugs: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  features: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
}

export default function ThreadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const feedbackData = t("feedbackPage")

  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replies, setReplies] = useState(initialMockReplies)
  const [threadLikes, setThreadLikes] = useState(mockThread.likes)
  const [isThreadLiked, setIsThreadLiked] = useState(mockThread.isLiked)

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

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new reply
    const newReply = {
      id: `r${Date.now()}`,
      content: replyContent,
      author: {
        name: "Current User", // This would come from auth context
        avatar: "/placeholder.svg",
        initials: "CU",
        role: "Community Member",
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    }

    setReplies((prev) => [...prev, newReply])
    setReplyContent("")
    setIsSubmitting(false)
  }

  const handleLike = (id: string, type: "thread" | "reply") => {
    if (type === "thread") {
      setIsThreadLiked(!isThreadLiked)
      setThreadLikes((prev) => (isThreadLiked ? prev - 1 : prev + 1))
    } else {
      setReplies((prev) =>
        prev.map((reply) =>
          reply.id === id
            ? {
                ...reply,
                isLiked: !reply.isLiked,
                likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              }
            : reply,
        ),
      )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 animate-fade-in-up">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {feedbackData.threadDetail.backButton}
        </Button>

        {/* Thread Content */}
        <Card className="mb-8 animate-fade-in-up animate-delay-200">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={categoryColors[mockThread.category]}>
                    {feedbackData.categories[mockThread.category]}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-card-foreground mb-4">{mockThread.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mockThread.author.avatar || "/placeholder.svg"} alt={mockThread.author.name} />
                      <AvatarFallback>{mockThread.author.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{mockThread.author.name}</div>
                      <div className="text-xs">{mockThread.author.role}</div>
                    </div>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>
                        {mockThread.views} {feedbackData.threadStats.views}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {replies.length} {feedbackData.threadStats.replies}
                      </span>
                    </div>
                    <span>{formatTimeAgo(mockThread.createdAt)}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    {feedbackData.threadDetail.editButton}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    {feedbackData.threadDetail.shareButton}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Flag className="h-4 w-4 mr-2" />
                    {feedbackData.threadDetail.reportButton}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {feedbackData.threadDetail.deleteButton}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
              {mockThread.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLike(mockThread.id, "thread")}
                className={isThreadLiked ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isThreadLiked ? "fill-current" : ""}`} />
                {threadLikes} {feedbackData.threadDetail.likeButton}
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                {feedbackData.threadDetail.shareButton}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Replies Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold animate-fade-in-up animate-delay-400">
            {replies.length} {feedbackData.threadStats.replies}
          </h2>

          {/* Reply Form */}
          <Card className="animate-fade-in-up animate-delay-600">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Textarea
                  placeholder={feedbackData.threadDetail.replyPlaceholder}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim() || isSubmitting}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? "Posting..." : feedbackData.threadDetail.submitReply}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Replies List */}
          {replies.map((reply, index) => (
            <Card key={reply.id} className="animate-fade-in-up" style={{ animationDelay: `${800 + index * 100}ms` }}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.author.avatar || "/placeholder.svg"} alt={reply.author.name} />
                    <AvatarFallback>{reply.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-foreground">{reply.author.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {reply.author.role}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatTimeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-card-foreground mb-4">{reply.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(reply.id, "reply")}
                        className={reply.isLiked ? "text-red-500" : ""}
                      >
                        <ThumbsUp className={`h-4 w-4 mr-2 ${reply.isLiked ? "fill-current" : ""}`} />
                        {reply.likes}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        {feedbackData.threadDetail.replyButton}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            {feedbackData.threadDetail.editButton}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Flag className="h-4 w-4 mr-2" />
                            {feedbackData.threadDetail.reportButton}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            {feedbackData.threadDetail.deleteButton}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
