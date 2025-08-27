"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"

export default function Testimonials() {
  const { language } = useLanguage()
  const data = language === "en" ? enLanding.testimonials : idLanding.testimonials

  return (
    <section
      id="testimonials"
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
          {data.items.map((testimonial: any, index: number) => (
            <Card
              key={index}
              className="
                relative p-6 text-left
                bg-card text-card-foreground border-border
                hover:shadow-lg transition-shadow duration-300
              "
            >
              {/* Quote icon */}
              <Quote
                className="
                  absolute top-4 right-4 w-8 h-8
                  text-blue-200/60 dark:text-blue-300/30
                "
              />

              <CardContent className="p-0">
                <p className="italic leading-relaxed mb-6 text-muted-foreground">
                  “{testimonial.content}”
                </p>

                <div className="flex items-center gap-4">
                  <Avatar className="ring-1 ring-border">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-muted text-foreground">
                      {testimonial.author
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 3)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-muted-foreground/80">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
