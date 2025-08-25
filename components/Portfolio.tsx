"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import landingData from "@/data/landing.json"

export default function Portfolio() {
  const { language } = useLanguage()

  const portfolioData = landingData[language as keyof typeof landingData]?.portfolio || landingData.en.portfolio

  return (
    <section id="portfolio" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-slate-900 mb-4">{portfolioData.title}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">{portfolioData.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioData.projects.map((project: any, index: number) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                    <Button size="sm" className="bg-white text-slate-900 hover:bg-slate-100">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 text-slate-900 border-slate-200 hover:bg-white"
                    >
                      <Github className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <Badge variant="secondary" className="mb-3 text-blue-600 bg-blue-50">
                  {project.category}
                </Badge>
                <h3 className="font-serif text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
            {language === "id" ? "Lihat Semua Proyek" : "View All Projects"}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
