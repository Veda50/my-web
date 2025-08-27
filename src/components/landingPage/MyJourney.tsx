"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"
import Link from "next/link"

export default function MyJourney() {
  const { language } = useLanguage()
  const data = language === "en" ? enLanding.journey : idLanding.journey

  return (
    <section
      id="journey"
      className="
        py-16 px-6
        bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100
        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950
      "
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {data.title}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {data.subtitle}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div
            className="
              absolute left-10 top-0 bottom-0 w-0.5
              bg-gradient-to-b from-blue-600 via-blue-400 to-transparent
              dark:from-blue-500 dark:via-blue-400 dark:to-transparent
            "
          />

          <div className="space-y-16">
            {data.experiences.map((experience: any, index: number) => (
              <div key={index} className="relative flex items-start gap-8 group">
                {/* Dot */}
                <div className="absolute left-8 flex-shrink-0">
                  <div
                    className="
                      w-4 h-4 bg-blue-600 rounded-full
                      border-4 border-white dark:border-slate-900
                      shadow-lg z-10 relative
                      group-hover:scale-125 transition-transform duration-300
                    "
                  />
                  <div
                    className="
                      absolute inset-0 w-4 h-4 rounded-full
                      bg-blue-200 dark:bg-blue-300
                      animate-ping opacity-20
                    "
                  />
                </div>

                {/* Card */}
                <div
                  className="
                    flex-1 pb-8 ml-16
                  "
                >
                  <div
                    className="
                      bg-white dark:bg-slate-900/60
                      backdrop-blur-sm
                      rounded-xl shadow-sm
                      border border-slate-200 dark:border-slate-800
                      p-8
                      transition-all duration-300
                      group-hover:shadow-lg
                      group-hover:border-blue-200 dark:group-hover:border-blue-700
                    "
                  >
                    {/* Header info */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="space-y-2">
                        <Badge
                          variant="outline"
                          className="
                            w-fit
                            text-blue-700 border-blue-200 bg-blue-50
                            dark:text-blue-300 dark:border-blue-800 dark:bg-blue-900/20
                          "
                        >
                          {experience.period}
                        </Badge>

                        <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                          {experience.role}
                        </h3>

                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-lg">
                          {experience.company}
                        </p>

                        <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {experience.location}
                        </p>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div
                      className="
                        space-y-3 pl-4
                        border-l-2 border-slate-200 dark:border-slate-700
                      "
                    >
                      {experience.achievements.map((achievement: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 group/item">
                          <div
                            className="
                              flex-shrink-0 w-2 h-2 rounded-full mt-2
                              bg-emerald-500 dark:bg-emerald-400
                              group-hover/item:bg-emerald-600 dark:group-hover/item:bg-emerald-300
                              transition-colors
                            "
                          />
                          <p
                            className="
                              text-slate-600 dark:text-slate-300
                              group-hover/item:text-slate-700 dark:group-hover/item:text-slate-200
                              leading-relaxed transition-colors
                            "
                          >
                            {achievement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline footer / more */}
          <Link href="/about/experiences" className="relative mt-8 ml-10 text-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse [animation-delay:200ms]" />
                <div className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full animate-pulse [animation-delay:400ms]" />
                <span
                  className="
                    text-blue-600 dark:text-blue-400
                    hover:text-blue-800 dark:hover:text-blue-300
                    cursor-pointer font-medium transition-all duration-300
                    hover:underline hover:underline-offset-4 group
                  "
                >
                  {data.otherLabel}
                  <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
