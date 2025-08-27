"use client"

import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/contexts/ThemeContext"
import { useLanguage } from "@/contexts/LanguageContext"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const { t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          {theme === "light" && <Sun className="w-4 h-4" />}
          {theme === "dark" && <Moon className="w-4 h-4" />}
          {theme === "system" && <Monitor className="w-4 h-4" />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className={theme === "light" ? "bg-orange-500" : ""}>
          <Sun className="w-4 h-4 mr-2" />
          {t("theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className={theme === "dark" ? "bg-orange-500" : ""}>
          <Moon className="w-4 h-4 mr-2" />
          {t("theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className={theme === "system" ? "bg-orange-500" : ""}>
          <Monitor className="w-4 h-4 mr-2" />
          {t("theme.system")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
