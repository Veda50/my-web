"use client"

import { Badge } from "@/components/ui/badge"
import { ArrowRight, MoreHorizontal } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import landingData from "@/data/landing.json"

export default function About() {
  const { language } = useLanguage()

  const aboutData = landingData[language as keyof typeof landingData]?.about || landingData.en.about

  return (
    <section id="about" className="py-16 px-6 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white">{aboutData.title}</h2>
            <div className="flex-1 flex justify-end">
              <button className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-300 group">
                <span className="border-b border-dotted border-slate-300 group-hover:border-blue-600">
                  detailed expertise
                </span>
                <ArrowRight className="w-3 h-3 ml-1 inline-block group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">{aboutData.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {aboutData.skills.map((skill: any, index: number) => {
            const colors = [
              {
                bg: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
                border: "border-blue-200/50 dark:border-blue-700/50",
                badge: "bg-blue-600",
                text: "text-blue-700 dark:text-blue-300",
                hover: "text-blue-600 hover:text-blue-800 dark:hover:text-blue-400",
              },
              {
                bg: "from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20",
                border: "border-green-200/50 dark:border-green-700/50",
                badge: "bg-green-600",
                text: "text-green-700 dark:text-green-300",
                hover: "text-green-600 hover:text-green-800 dark:hover:text-green-400",
              },
              {
                bg: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
                border: "border-purple-200/50 dark:border-purple-700/50",
                badge: "bg-purple-600",
                text: "text-purple-700 dark:text-purple-300",
                hover: "text-purple-600 hover:text-purple-800 dark:hover:text-purple-400",
              },
              {
                bg: "from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20",
                border: "border-orange-200/50 dark:border-orange-700/50",
                badge: "bg-orange-600",
                text: "text-orange-700 dark:text-orange-300",
                hover: "text-orange-600 hover:text-orange-800 dark:hover:text-orange-400",
              },
            ]
            const colorScheme = colors[index % colors.length]
            const emojis = ["🎯", "⚙️", "☁️", "🧠"]

            return (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${colorScheme.bg} rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border ${colorScheme.border}`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/30 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">{emojis[index]}</span>
                    </div>
                    <Badge className={`${colorScheme.badge} text-white hover:${colorScheme.badge}/90`}>
                      {skill.category}
                    </Badge>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white mb-2">{skill.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{skill.description}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    {skill.technologies.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className={`px-3 py-1 bg-white/70 dark:bg-slate-700/70 ${colorScheme.text} text-sm rounded-full font-medium`}
                      >
                        {tech}
                      </span>
                    ))}
                    {skill.technologies.length > 3 && (
                      <button
                        className={`flex items-center px-2 py-1 ${colorScheme.hover} transition-colors group/more`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="text-xs ml-1 opacity-0 group-hover/more:opacity-100 transition-opacity">
                          +{skill.technologies.length - 3} more
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
