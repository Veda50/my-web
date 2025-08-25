"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import landingData from "@/data/landing.json"
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

type Language = "en" | "id"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Get language from localStorage or default to English
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setLanguage(savedLanguage)
  }, [])

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem("language", language)

    // Update document lang attribute
    document.documentElement.lang = language
  }, [language])

  // Simple translation function for basic UI elements
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

  const t = (key: string): any => {
    // Handle landing page data
    if (key === "landing") {
      return landingData[language]
    }

    // Handle not found page data
    if (key === "notFoundPage") {
      return language === "id" ? idNotFoundData : enNotFoundData
    }

    // Handle feedback page data
    if (key === "feedbackPage") {
      return language === "id" ? idFeedbackData : enFeedbackData
    }

    // Handle projects page data
    if (key === "projectsPage") {
      return language === "id" ? idProjectsData : enProjectsData
    }

    // Handle skills page data
    if (key === "skillsPage") {
      return language === "id" ? idSkillsData : enSkillsData
    }

    // Handle studio page data
    if (key === "studioPage") {
      return language === "id" ? idStudioData : enStudioData
    }

    // Handle blog page data
    if (key === "blogPage") {
      return language === "id" ? idBlogData : enBlogData
    }

    // Handle experiences page data
    if (key === "experiencesPage") {
      return language === "id" ? idExperiencesData : enExperiencesData
    }

    // Handle simple translations
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
