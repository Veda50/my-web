"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Home,
  User,
  Briefcase,
  MessageSquare,
  Settings,
  Globe,
  Sun,
  Moon,
  LogOut,
  Calendar,
  Code,
  FileText,
} from "lucide-react"
import { useRouter } from "next/navigation"
import menuData from "@/data/menu.json"

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  activeSection: string
  isDarkMode: boolean
  setIsDarkMode: (dark: boolean) => void
  language: string
  setLanguage: (lang: string) => void
  scrollToSection: (sectionId: string) => void
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSection,
  isDarkMode,
  setIsDarkMode,
  language,
  setLanguage,
  scrollToSection,
}: SidebarProps) {
  const router = useRouter()

  const getIconForMenuItem = (title: string) => {
    switch (title.toLowerCase()) {
      case "home":
        return Home
      case "my work":
        return Briefcase
      case "projects":
        return Code
      case "studio":
        return Settings
      case "blogs":
        return FileText
      case "code snippets":
        return Code
      case "feedback":
        return MessageSquare
      case "about":
        return User
      case "my experiences":
        return Calendar
      case "my skills":
        return User
      default:
        return Home
    }
  }

  const handleNavigation = (route: string) => {
    if (route === "/") {
      // For home route, scroll to hero section
      scrollToSection("hero")
    } else {
      // For other routes, use router navigation
      router.push(route)
    }
    setSidebarOpen(false)
  }

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full pt-20">
          {/* Account Section */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="/creative-designer-headshot.png" />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                  AM
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Alex Morgan</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Creative Designer</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs p-2"
              >
                <Settings className="w-3 h-3 mr-1" />
                Settings
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 p-2"
              >
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              {menuData.map((item, index) => {
                const Icon = getIconForMenuItem(item.title)
                const hasSubItems = item.sub && item.sub.length > 0
                const isActive = activeSection === item.title.toLowerCase().replace(" ", "-")

                return (
                  <div key={index}>
                    <button
                      onClick={() => handleNavigation(item.route)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{item.title}</span>
                      </div>
                    </button>

                    {hasSubItems && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 dark:border-slate-700 pl-3">
                        {item.sub.map((subItem, subIndex) => {
                          const SubIcon = getIconForMenuItem(subItem.title)
                          return (
                            <button
                              key={subIndex}
                              onClick={() => handleNavigation(subItem.route)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-left transition-colors text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 text-sm"
                            >
                              <div className="w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                              <span>{subItem.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "EN" ? "ID" : "EN")}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs"
              >
                <Globe className="w-3 h-3 mr-2" />
                {language}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}
