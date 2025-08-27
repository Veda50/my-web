"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, AlertTriangle } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function NotFound() {
  const [countdown, setCountdown] = useState(4)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const { t } = useLanguage()

  // Load not found page translations
  const notFoundData = t("notFoundPage") || {
    title: "404 - Page Not Found",
    subtitle: "Oops! The page you're looking for doesn't exist.",
    description:
      "The page you are trying to access may have been moved, deleted, or you may have entered an incorrect URL.",
    backButton: "Go Back",
    homeButton: "Go Home",
    countdownText: "Automatically redirecting in {seconds} seconds...",
    errorCode: "404",
  }

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true)

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.back()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleGoBack = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div
        className={`max-w-2xl mx-auto text-center transition-all duration-1000 transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Animated 404 Number */}
        <div className="relative mb-8">
          <div
            className={`text-9xl md:text-[12rem] font-bold text-red-600/20 select-none transition-all duration-1500 ${
              isVisible ? "scale-100 rotate-0" : "scale-75 rotate-12"
            }`}
          >
            {notFoundData.errorCode}
          </div>

          {/* Floating Alert Icon */}
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-2000 ${
              isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <div className="relative">
              <AlertTriangle className="w-16 h-16 md:w-20 md:h-20 text-red-600 animate-pulse" />
              <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-2 border-primary rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`space-y-6 transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{notFoundData.title}</h1>

          <p className="text-xl text-muted-foreground">{notFoundData.subtitle}</p>

          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{notFoundData.description}</p>

          {/* Countdown */}
          <div
            className={`bg-muted/50 backdrop-blur-sm rounded-lg p-4 mx-auto max-w-sm transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <p className="text-sm text-muted-foreground">
              {notFoundData.countdownText.replace("{seconds}", countdown.toString())}
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((4 - countdown) / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center mt-8 transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <Button
            onClick={handleGoBack}
            variant="default"
            size="lg"
            className="group hover:scale-105 transition-all duration-200 bg-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            {notFoundData.backButton}
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            className="group hover:scale-105 transition-all duration-200 bg-transparent"
          >
            <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            {notFoundData.homeButton}
          </Button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute top-1/4 left-1/4 w-2 h-2 bg-blue-600/30 rounded-full transition-all duration-3000 ${
              isVisible ? "animate-bounce" : "opacity-0"
            }`}
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className={`absolute top-1/3 right-1/4 w-1 h-1 bg-blue-600/40 rounded-full transition-all duration-3000 ${
              isVisible ? "animate-bounce" : "opacity-0"
            }`}
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className={`absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-600/20 rounded-full transition-all duration-3000 ${
              isVisible ? "animate-bounce" : "opacity-0"
            }`}
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>
    </div>
  )
}
