"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"
import { SiGithub, SiLinkedin } from "react-icons/si"

export default function Contact() {
  const { language } = useLanguage()

  const data = language === 'en' ? enLanding.contacts : idLanding.contacts

  return (
    <section
      id="contact"
      className="py-16 px-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {data.title || "Let's Connect and Collaborate"}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          {data.subtitle ||
            "Ready to bring your ideas to life? I'd love to hear about your project and explore how we can work together to create something amazing."}
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {(
           [
              { type: "Email", value: "vedabezaleel@gmail.com" },
              { type: "LinkedIn", value: "Veda Bezaleel" },
              { type: "GitHub", value: "Veda50" },
            ]
          ).map((method: any, index: number) => {
            const icons = [Mail, SiLinkedin, SiGithub]
            const Icon = icons[index] || Mail

            return (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800 dark:border-slate-700"
              >
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{method.type}</h3>
                <p className="text-slate-600 dark:text-slate-300">{method.value}</p>
              </Card>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Mail className="w-4 h-4 mr-2" />
            {data.cta?.primary || "Send Message"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {data.cta?.secondary || "Schedule Call"}
          </Button>
        </div>
      </div>
    </section>
  )
}
