"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Code2,
  Database,
  ChevronDown,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
} from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"
import LocalTime from "@/components/LocalTime"
import projectPageData from "@/data/en/projectsPage.json"
import { ParticleBackground } from "./ParticleBackground"
import { Divider } from "./Divider"
import { SiLinkedin } from "react-icons/si"

interface HeroProps {
  isVisible: boolean
  scrollToSection: (sectionId: string) => void
}

export default function Hero({ isVisible, scrollToSection }: HeroProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { language } = useLanguage()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Check for dark mode preference
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDark(document.documentElement.classList.contains('dark'))
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const data = language === 'en' ? enLanding.hero : idLanding.hero
  const totalProject: number = projectPageData.projects.length + 1
  const totalExperiences: number = new Date().getFullYear() - 2023

  return (
    <>
      <section
        id="hero"
        className="relative min-h-screen flex items-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background Elements - Updated colors for better contrast */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-br from-blue-100 via-blue-50/95 to-blue-100"
          }`}
        >
          {/* Gradient orbs - reduced opacity for less distraction */}
          <div
            className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-15 ${
              isDark ? "bg-blue-600" : "bg-blue-400"
            }`}
            style={{ transform: "translate(-50%, -50%)" }}
          />
          <div
            className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-15 ${
              isDark ? "bg-purple-600" : "bg-purple-400"
            }`}
            style={{ transform: "translate(50%, 50%)" }}
          />
        </div>

        {/* Particle Background */}
        <ParticleBackground isDark={isDark} />

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Profile Card - Updated background for better contrast */}
            <div
              className={`lg:col-span-4 relative rounded-2xl p-6 sm:p-7 backdrop-blur-xl transition-colors duration-300 ${
                isDark
                  ? "bg-slate-800/80 border border-slate-700/60 shadow-xl shadow-blue-500/10"
                  : "bg-white/95 border border-blue-100 shadow-xl shadow-blue-500/20"
              } ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}
            >
              {/* Profile Image */}
              <div className="relative mb-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-orange-500 p-1">
                  <img
                    src="/img/me.jpg"
                    alt={data.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info - Clean Version */}
              <div className="text-center space-y-4">
                <div>
                  <h2
                    className={`text-lg font-bold ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {data.name}
                  </h2>
                  <p className="text-orange-500 font-medium text-xs mt-0.5">
                    {data.title}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{data.location}</span>
                  </div>
                  <div
                    className={`flex items-center justify-center gap-1 ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>
                      <LocalTime
                        locale={language === "id" ? "id-ID" : "en-US"}
                        hour12={language !== "id"}
                        placeholder="--:--"
                      />
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/50">
                  <div className="text-center">
                    <div
                      className={`text-base font-bold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {totalProject}+
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {data.stats.projects.label}
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-base font-bold ${
                        isDark ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      {totalExperiences}+
                    </div>
                    <div
                      className={`text-xs mt-0.5 ${
                        isDark ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {data.stats.experience.label}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                    isDark
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-medium">{data.status}</span>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div
              className={`lg:col-span-8 space-y-6 ${
                isVisible
                  ? "animate-slide-in-right animate-delay-200"
                  : "opacity-0"
              }`}
            >
              <div className="space-y-4">
                <h1
                  className={`font-bold text-3xl sm:text-4xl lg:text-5xl transition-colors duration-300 leading-tight ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {data.headline}
                </h1>
                <p
                  className={`text-base sm:text-lg transition-colors duration-300 ${
                    isDark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {data.subheadline}
                </p>
              </div>

              {/* Tech Stack */}
              <div className="space-y-3">
                <h3
                  className={`text-xs uppercase tracking-wider font-medium ${
                    isDark ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  {data.techStack.map((tech: string, index: number) => {
                    const icons = [Code2, Code2, Database];
                    const Icon = icons[index] || Code2;
                    const colors = [
                      isDark
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        : "bg-blue-100 text-blue-700 border-blue-300",
                      isDark
                        ? "bg-green-500/15 text-green-300 border-green-500/30"
                        : "bg-green-100 text-green-700 border-green-300",
                      isDark
                        ? "bg-orange-500/15 text-orange-300 border-orange-500/30"
                        : "bg-orange-100 text-orange-700 border-orange-300",
                    ];

                    return (
                      <div
                        key={tech}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 hover:shadow-md ${
                          colors[index % colors.length]
                        } sequential-fade-in cursor-pointer`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tech}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Buttons - Fixed Get in Touch button */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 group"
                  onClick={() => scrollToSection("portfolio")}
                >
                  {data.buttons.viewWork}
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  className={`px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-all duration-300 hover:scale-105 border backdrop-blur-sm ${
                    isDark
                      ? "bg-slate-800/70 hover:bg-slate-700/70 text-slate-100 border-slate-700 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/15"
                      : "bg-white/95 hover:bg-blue-50/95 text-slate-800 border-slate-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/25"
                  }`}
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/veda-bezaleel/",
                      "_blank"
                    )
                  }
                >
                  <SiLinkedin
                    className={`w-5 h-5 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <span className={isDark ? "text-slate-100" : "text-slate-800"}>
                    {data.buttons.getInTouch}
                  </span>
                </Button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-12 sm:mt-16">
            <button
              onClick={() => scrollToSection("about")}
              className={`animate-bounce transition-colors p-2 hover:scale-110 duration-300 ${
                isDark
                  ? "text-slate-400 hover:text-orange-500"
                  : "text-slate-500 hover:text-orange-500"
              }`}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <Divider isDark={isDark} />
        </div>
      </section>
    </>
  );
}