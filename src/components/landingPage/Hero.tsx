"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Code2,
  Database,
  ChevronDown,
  Download,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"
import LocalTime from "../LocalTime"
import projectPageData from "@/data/en/projectsPage.json"
import { FaCode } from "react-icons/fa"

interface HeroProps {
  isVisible: boolean
  scrollToSection: (sectionId: string) => void
}

export default function Hero({ isVisible, scrollToSection }: HeroProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { language } = useLanguage()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const data = language === 'en' ? enLanding.hero : idLanding.hero
  const totalProject: number = projectPageData.projects.length + 1;
  const totalExperiences: number = new Date().getFullYear() - 2023;

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-8 pb-16 px-6 gradient-shift"
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left side - Profile Card */}
          <div
            className={`lg:col-span-4 ${
              isVisible ? "animate-slide-in-left" : "opacity-0"
            }`}
          >
            <div className="relative bg-card dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-border dark:border-slate-700 card-hover-lift">
              <div className="absolute -top-2 -right-2 gentle-float">
                <div className="w-6 h-6 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-accent-foreground" />
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-orange-500 p-1 tech-pulse">
                  <img
                    src="/img/me.jpg"
                    alt={data.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {data.name}
                  </h2>
                  <p className="text-orange-500 font-medium text-sm">
                    {data.title}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{data.location}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      <LocalTime
                        locale={language === "id" ? "id-ID" : "en-US"}
                        hour12={language !== "id"} // contoh: ID 24-jam, EN 12-jam
                        placeholder="--:--"
                      />
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {totalProject}+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.stats.projects.label}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {totalExperiences}+
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {data.stats.experience.label}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full">
                  <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs text-blue-600 dark:text-blue-400">{data.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Main Content */}
          <div
            className={`lg:col-span-8 space-y-6 ${
              isVisible
                ? "animate-slide-in-right animate-delay-200"
                : "opacity-0"
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-4">
                <h1 className="font-bold text-5xl lg:text-6xl text-foreground leading-tight">
                  {data.headline}
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {data.subheadline}
                </p>
              </div>
            </div>

            {/* Tech Stack Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {data.techStack.map((tech: string, index: number) => {
                  const icons = [Code2, Code2, Database];
                  const Icon = icons[index] || Code2;
                  const colors = [
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
                  ];
                  return (
                    <div
                      key={tech}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        colors[index % colors.length]
                      } transition-all duration-300 hover:scale-105 hover:shadow-md sequential-fade-in cursor-pointer`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tech}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Button
                size="default"
                className="bg-orange-500 hover:bg-orange-500/90 text-accent-foreground group px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                onClick={() => scrollToSection("portfolio")}
              >
                {data.buttons.viewWork}
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="default"
                className="border-border text-foreground hover:bg-orange-500/10 px-6 py-3 rounded-xl bg-transparent transition-all duration-300 hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                {data.buttons.getInTouch}
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => scrollToSection("about")}
            className="animate-bounce text-muted-foreground hover:text-orange-500 transition-colors p-2 hover:scale-110 duration-300"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
