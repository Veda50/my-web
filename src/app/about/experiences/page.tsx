"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Calendar, Filter } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

type ExperienceItem = {
  period: string
  role: string
  company: string
  type: "fulltime" | "freelance" | "internship" | "volunteer" | "organization" | "education" | string
  location?: string
  description: string
  technologies?: string[]
}

export default function ExperiencesPage() {
  const { t } = useLanguage()
  const data = t("experiencesPage") as {
    title: string
    subtitle: string
    filterLabel: string
    filterOptions: Record<string, string>
    present?: string
    experiences: ExperienceItem[]
  }

  const [selectedFilter, setSelectedFilter] = useState<string>("all")

  const allExperiences = data?.experiences ?? []

  const filteredExperiences = useMemo(() => {
    if (selectedFilter === "all") return allExperiences
    return allExperiences.filter((exp) => exp.type === selectedFilter)
  }, [allExperiences, selectedFilter])

  const selectedFilterLabel = data?.filterOptions?.[selectedFilter] ?? "All"

  const timelineStartLabel = useMemo(() => {
    if (!allExperiences.length) return ""
    const starts = allExperiences
      .map((e) => (typeof e.period === "string" ? e.period.split(" - ")[0]?.trim() : ""))
      .filter(Boolean)

    return starts[starts.length - 1] ?? ""
  }, [allExperiences])

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fulltime: "bg-blue-100 text-blue-800 border-blue-200",
      freelance: "bg-green-100 text-green-800 border-green-200",
      internship: "bg-orange-100 text-orange-800 border-orange-200",
      volunteer: "bg-purple-100 text-purple-800 border-purple-200",
      organization: "bg-cyan-100 text-cyan-800 border-cyan-200",
      education: "bg-pink-100 text-pink-800 border-pink-200",
    }
    return colors[type] ?? "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {data.title}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500" />
            <span className="text-slate-700 dark:text-slate-200 font-medium">{data.filterLabel}</span>
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full sm:w-56 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-blue-400 focus:ring-blue-400/20">
              <SelectValue placeholder={selectedFilterLabel} />
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
          {/* Vertical line */}
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-blue-200 dark:from-blue-500 dark:via-blue-400 dark:to-blue-300" />

          <div className="space-y-12">
            {filteredExperiences.map((exp, index) => {
              const key = `${exp.role}-${exp.company}-${exp.period}-${index}`
              const typeLabel = data.filterOptions?.[exp.type] ?? exp.type

              return (
                <div key={key} className="relative group">
                  {/* Dot */}
                  <div className="absolute left-8 flex-shrink-0">
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg dark:border-slate-900 z-10 relative group-hover:scale-125 transition-all duration-300" />
                    <div className="absolute inset-0 w-4 h-4 bg-blue-200 dark:bg-blue-300 rounded-full animate-ping opacity-30" />
                  </div>

                  {/* Card */}
                  <div className="ml-20 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 group-hover:shadow-lg group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all duration-300">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                            <Calendar className="w-3 h-3 mr-1" />
                            {exp.period}
                          </Badge>
                          <Badge className={getTypeColor(exp.type)}>{typeLabel}</Badge>
                        </div>

                        <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-200 transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">{exp.company}</p>

                        {!!exp.location && (
                          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">{exp.description}</p>
                    </div>

                    {/* Technologies */}
                    {Array.isArray(exp.technologies) && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <Badge
                            key={`${tech}-${i}`}
                            variant="secondary"
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Timeline start cap */}
          <div className="relative mt-12 ml-10 text-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse [animation-delay:200ms]" />
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse [animation-delay:400ms]" />
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-2">
                  {timelineStartLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
