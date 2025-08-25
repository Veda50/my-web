"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import landingData from "@/data/landing.json"

export default function Testimonials() {
  const { language } = useLanguage()

  const testimonialsData =
    landingData[language as keyof typeof landingData]?.testimonials || landingData.en.testimonials

  return (
    <section id="testimonials" className="py-16 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-slate-900 mb-4">{testimonialsData.title}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">{testimonialsData.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.items.map((testimonial: any, index: number) => (
            <Card key={index} className="relative p-6 text-center hover:shadow-lg transition-shadow duration-300">
              <Quote className="absolute top-4 right-4 w-8 h-8 text-blue-200" />
              <CardContent className="p-0">
                <p className="text-slate-600 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {testimonial.author
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-slate-900">{testimonial.author}</h4>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                    <p className="text-xs text-slate-500">{testimonial.company}</p>
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
