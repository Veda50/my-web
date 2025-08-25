"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import landingData from "@/data/landing.json"

export default function MyJourney() {
  const { language } = useLanguage()

  const journeyData = landingData[language as keyof typeof landingData]?.journey || landingData.en.journey

  return (
    <section id="journey" className="py-16 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-slate-900 mb-4">{journeyData.title}</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">{journeyData.subtitle}</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-blue-400 to-transparent"></div>

          <div className="space-y-16">
            {journeyData.experiences.map((experience: any, index: number) => (
              <div key={index} className="relative flex items-start gap-8 group">
                <div className="absolute left-8 flex-shrink-0">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10 relative group-hover:scale-125 transition-transform duration-300"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-blue-200 rounded-full animate-ping opacity-20"></div>
                </div>

                <div className="flex-1 pb-8 ml-16">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 w-fit">
                        {experience.period}
                      </Badge>
                      <h3 className="font-serif text-2xl font-bold text-slate-900">{experience.role}</h3>
                      <p className="text-blue-600 font-semibold text-lg">{experience.company}</p>
                      <p className="text-slate-500 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pl-4 border-l-2 border-slate-200">
                    {experience.achievements.map((achievement: string, achievementIndex: number) => (
                      <div key={achievementIndex} className="flex items-start gap-3 group/item">
                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 group-hover/item:bg-green-600 transition-colors"></div>
                        <p className="text-slate-600 leading-relaxed group-hover/item:text-slate-700 transition-colors">
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative mt-8 ml-10 text-center">
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-pulse animation-delay-200"></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-pulse animation-delay-400"></div>
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium transition-all duration-300 hover:underline hover:underline-offset-4 group">
                  Pengalaman lainnya
                  <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
