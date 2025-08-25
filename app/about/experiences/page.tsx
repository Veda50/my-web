"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Filter } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ExperiencesPage() {
  const { t } = useLanguage()
  const data = t("experiencesPage")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredExperiences = useMemo(() => {
    if (selectedFilter === "all") {
      return data.experiences
    }
    return data.experiences.filter((exp: any) => exp.type === selectedFilter)
  }, [data.experiences, selectedFilter])

  const getTypeColor = (type: string) => {
    const colors = {
      fulltime: "bg-blue-100 text-blue-800 border-blue-200",
      freelance: "bg-green-100 text-green-800 border-green-200",
      internship: "bg-orange-100 text-orange-800 border-orange-200",
      contract: "bg-purple-100 text-purple-800 border-purple-200",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{data.title}</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">{data.subtitle}</p>
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700 font-medium">{data.filterLabel}</span>
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(data.filterOptions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200"></div>

          <div className="space-y-12">
            {filteredExperiences.map((experience: any, index: number) => (
              <div key={experience.id} className="relative group">
                {/* Timeline dot */}
                <div className="absolute left-8 flex-shrink-0">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10 relative group-hover:scale-125 transition-all duration-300"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-blue-200 rounded-full animate-ping opacity-30"></div>
                </div>

                {/* Experience card */}
                <div className="ml-20 bg-white rounded-xl shadow-sm border border-slate-200 p-8 group-hover:shadow-lg group-hover:border-blue-200 transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                          <Calendar className="w-3 h-3 mr-1" />
                          {experience.period}
                        </Badge>
                        <Badge className={getTypeColor(experience.type)}>{data.filterOptions[experience.type]}</Badge>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {experience.role}
                      </h3>
                      <p className="text-blue-600 font-semibold text-lg">{experience.company}</p>
                      <p className="text-slate-500 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-slate-600 leading-relaxed text-base">{experience.description}</p>
                  </div>

                  {/* Technologies */}
                  {experience.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech: string, techIndex: number) => (
                        <Badge
                          key={techIndex}
                          variant="secondary"
                          className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline end */}
          <div className="relative mt-12 ml-10 text-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse animation-delay-200"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-pulse animation-delay-400"></div>
                <span className="text-slate-500 text-sm font-medium mt-2">{data.present}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
