"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import Hero from "@/components/Hero"
import About from "@/components/About"
import MyJourney from "@/components/MyJourney"
import Portfolio from "@/components/Portfolio"
import Testimonials from "@/components/Testimonials"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import { useTheme } from "@/contexts/ThemeContext"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { isDarkMode, setTheme } = useTheme()
  const { language, setLanguage } = useLanguage()

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const sections = ["hero", "about", "journey", "portfolio", "testimonials", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: "smooth" })
    setSidebarOpen(false)
  }

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-white" : "bg-gradient-to-br from-slate-50 to-slate-100"}`}
    >
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        isDarkMode={isDarkMode}
        setIsDarkMode={(darkMode) => setTheme(darkMode ? "dark" : "light")}
        language={language === "en" ? "EN" : "ID"}
        setLanguage={(lang) => setLanguage(lang === "EN" ? "en" : "id")}
        scrollToSection={scrollToSection}
      />

      <main className="pt-20">
        <Hero isVisible={isVisible} scrollToSection={scrollToSection} />
        <About />
        <MyJourney />
        <Portfolio />
        <Testimonials />
        <Contact />
        <Footer />
      </main>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
