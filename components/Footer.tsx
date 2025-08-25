"use client"

import { Twitter, Linkedin, Mail, Github } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

export default function Footer() {
  const { landingData } = useLanguage()

  const footerData = landingData?.footer || {}

  return (
    <footer className="bg-foreground text-background py-12 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-4 right-8 w-20 h-20 bg-primary/10 rounded-full"></div>
        <div className="absolute bottom-4 left-12 w-16 h-16 bg-accent/10 rotate-45"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-sans font-black mb-4">{footerData.brand || "ALEX MORGAN"}</h3>
            <p className="text-background/80 leading-relaxed font-serif">
              {footerData.description ||
                "Full-stack developer crafting innovative web solutions with modern technologies and creative problem-solving."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 font-sans">{footerData.quickLinks?.title || "Quick Links"}</h4>
            <ul className="space-y-2 font-serif">
              {(
                footerData.quickLinks?.items || [
                  { label: "About", href: "#about" },
                  { label: "Portfolio", href: "#portfolio" },
                  { label: "Journey", href: "#journey" },
                  { label: "Contact", href: "#contact" },
                ]
              ).map((link: any, index: number) => (
                <li key={index}>
                  <a href={link.href} className="text-background/80 hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4 font-sans">{footerData.contact?.title || "Get In Touch"}</h4>
            <div className="space-y-2 text-background/80 font-serif">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{footerData.contact?.email || "alex.morgan@webdev.com"}</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-background/80 hover:text-accent transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-background/80 hover:text-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-background/80 hover:text-accent transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center text-background/60 font-serif">
          <p>
            {footerData.copyright || "© 2024 Alex Morgan. All rights reserved. Built with passion for web development."}
          </p>
        </div>
      </div>
    </footer>
  )
}
