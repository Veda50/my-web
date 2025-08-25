"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Linkedin, Github, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Contact() {
  const { landingData } = useLanguage()

  const contactData = landingData?.contact || {}

  return (
    <section
      id="contact"
      className="py-16 px-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-900"
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-4">
          {contactData.title || "Let's Connect and Collaborate"}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
          {contactData.subtitle ||
            "Ready to bring your ideas to life? I'd love to hear about your project and explore how we can work together to create something amazing."}
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {(
            contactData.methods || [
              { type: "Email", value: "alex@example.com" },
              { type: "LinkedIn", value: "@alexmorgan" },
              { type: "GitHub", value: "@alexmorgan" },
            ]
          ).map((method: any, index: number) => {
            const icons = [Mail, Linkedin, Github]
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
            {contactData.cta?.primary || "Send Message"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            {contactData.cta?.secondary || "Schedule Call"}
          </Button>
        </div>
      </div>
    </section>
  )
}
