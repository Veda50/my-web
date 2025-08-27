"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

import enLandingData from "@/data/en/landingPage.json"
import idLandingData from "@/data/id/landingPage.json"
import enNotFoundData from "@/data/en/notFoundPage.json"
import idNotFoundData from "@/data/id/notFoundPage.json"
import enFeedbackData from "@/data/en/feedbackPage.json"
import idFeedbackData from "@/data/id/feedbackPage.json"
import enProjectsData from "@/data/en/projectsPage.json"
import idProjectsData from "@/data/id/projectsPage.json"
import enSkillsData from "@/data/en/skillsPage.json"
import idSkillsData from "@/data/id/skillsPage.json"
import enStudioData from "@/data/en/studioPage.json"
import idStudioData from "@/data/id/studioPage.json"
import enBlogData from "@/data/en/blogPage.json"
import idBlogData from "@/data/id/blogPage.json"
import enExperiencesData from "@/data/en/experiencesPage.json"
import idExperiencesData from "@/data/id/experiencesPage.json"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("language")) as Language | null
    setLanguage(saved === "id" || saved === "en" ? saved : "en")
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("language", language)
      document.documentElement.lang = language
    }
  }, [language])

  // UI short strings
  const translations: Record<Language, Record<string, string>> = {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.work": "My Work",
      "nav.feedback": "Feedback",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "theme.system": "System",
      "language.en": "English",
      "language.id": "Bahasa Indonesia",
    },
    id: {
      "nav.home": "Beranda",
      "nav.about": "Tentang",
      "nav.work": "Karya Saya",
      "nav.feedback": "Umpan Balik",
      "theme.light": "Terang",
      "theme.dark": "Gelap",
      "theme.system": "Sistem",
      "language.en": "English",
      "language.id": "Bahasa Indonesia",
    },
  }

  // Helper pilih data per-locale dengan fallback EN
  const pick = <T,>(en: T, id: T): T => (language === "id" ? (id ?? en) : en)

  const t = (key: string): any => {
    switch (key) {
      case "landing":
        return pick(enLandingData, idLandingData)

      case "notFoundPage":
        return pick(enNotFoundData, idNotFoundData)

      case "feedbackPage":
        return pick(enFeedbackData, idFeedbackData)

      case "projectsPage":
        return pick(enProjectsData, idProjectsData)

      case "skillsPage":
        return pick(enSkillsData, idSkillsData)

      case "studioPage":
        return pick(enStudioData, idStudioData)

      case "blogPage":
        return pick(enBlogData, idBlogData)

      case "experiencesPage":
        return pick(enExperiencesData, idExperiencesData)

      default:
        // fallback untuk string pendek UI
        return translations[language][key] ?? key
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider")
  return ctx
}
