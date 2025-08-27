"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface NewThreadModalProps {
  onThreadCreated?: (thread: any) => void
}

export default function NewThreadModal({ onThreadCreated }: NewThreadModalProps) {
  const { t } = useLanguage()
  const feedbackData = t("feedbackPage")

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.category || !formData.content.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create new thread object
    const newThread = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      author: {
        name: "Current User", // This would come from auth context
        avatar: "/placeholder.svg",
        initials: "CU",
      },
      category: formData.category,
      replies: 0,
      views: 1,
      likes: 0,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isPopular: false,
    }

    onThreadCreated?.(newThread)

    // Reset form
    setFormData({ title: "", category: "", content: "" })
    setIsSubmitting(false)
    setIsOpen(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          {feedbackData.newThreadButton}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{feedbackData.newThread.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder={feedbackData.newThread.titlePlaceholder}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">{feedbackData.newThread.categoryLabel}</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback">{feedbackData.categories.feedback}</SelectItem>
                <SelectItem value="bugs">{feedbackData.categories.bugs}</SelectItem>
                <SelectItem value="features">{feedbackData.categories.features}</SelectItem>
                <SelectItem value="general">{feedbackData.categories.general}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder={feedbackData.newThread.contentPlaceholder}
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="min-h-[150px]"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {feedbackData.newThread.cancelButton}
            </Button>
            <Button
              type="submit"
              disabled={!formData.title.trim() || !formData.category || !formData.content.trim() || isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmitting ? "Posting..." : feedbackData.newThread.submitButton}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
