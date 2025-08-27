"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiWhatsapp } from "react-icons/si";
import { useLanguage } from "@/contexts/LanguageContext";

import enFooter from "@/data/en/footerSection.json";
import idFooter from "@/data/id/footerSection.json";

type FooterData = {
  brand?: { name?: string; tagline?: string };
  description?: string;
  quickLinks?: { title?: string; items?: { label: string; href: string }[] };
  contact?: {
    title?: string;
    email?: string;
    socials?: { github?: string; linkedin?: string; whatsapp?: string };
  };
  copyright?: string;
};

export default function Footer() {
  const { language } = useLanguage();

  const footerData: FooterData = useMemo(
    () => (language === "id" ? (idFooter as FooterData) : (enFooter as FooterData)) ?? (enFooter as FooterData),
    [language]
  );

  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  const brandName = footerData.brand?.name ?? "VEDA BEZALEEL";
  const description =
    footerData.description ??
    "Full-stack developer crafting innovative web solutions with modern technologies and creative problem-solving.";

  const quickLinks =
    footerData.quickLinks?.items ??
    [
      { label: language === "id" ? "Tentang" : "About", href: "#about" },
      { label: language === "id" ? "Portofolio" : "Portfolio", href: "#portfolio" },
      { label: language === "id" ? "Perjalanan" : "Journey", href: "#journey" },
      { label: language === "id" ? "Kontak" : "Contact", href: "#contact" },
    ];

  const quickLinksTitle = footerData.quickLinks?.title ?? (language === "id" ? "Tautan Cepat" : "Quick Links");

  const contactTitle = footerData.contact?.title ?? (language === "id" ? "Hubungi Saya" : "Get In Touch");
  const email = footerData.contact?.email ?? "vedabezaleel@gmail.com";
  const socials = footerData.contact?.socials ?? {};

  const computedCopyright =
    footerData.copyright ??
    (language === "id"
      ? `© ${year ?? ""} ${brandName}. Semua hak dilindungi. Dibangun dengan semangat untuk pengembangan web.`
      : `© ${year ?? ""} ${brandName}. All rights reserved. Built with passion for web development.`);

  const isInternal = (href: string) => href.startsWith("#") || href.startsWith("/");

  return (
    <footer
      className="
        relative overflow-hidden
        py-12
        bg-background
        text-foreground
      "
    >
      {/* decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 right-8 w-20 h-20 bg-primary/10 rounded-full" />
        <div className="absolute bottom-4 left-12 w-16 h-16 bg-accent/10 rotate-45" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-sans font-black mb-3">{brandName}</h3>
            <p className="text-muted-foreground leading-relaxed font-serif">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 font-sans">{quickLinksTitle}</h4>
            <ul className="space-y-2 font-serif">
              {quickLinks.map((link, i) => (
                <li key={`${link.href}-${i}`}>
                  {isInternal(link.href) ? (
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 font-sans">{contactTitle}</h4>
            <div className="space-y-2 text-muted-foreground font-serif">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-foreground/80" />
                <a
                  href={`mailto:${email}`}
                  className="hover:text-primary transition-colors underline-offset-4 hover:underline"
                >
                  {email}
                </a>
              </div>
              <div className="flex gap-4 mt-4">
                {socials.github && (
                  <a
                    href={socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <SiGithub className="w-5 h-5" />
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <SiLinkedin className="w-5 h-5" />
                  </a>
                )}
                {socials.whatsapp && (
                  <a
                    href={socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <SiWhatsapp className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-border pt-8 text-center font-serif">
          <p className="text-muted-foreground" suppressHydrationWarning>
            {computedCopyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
