"use client"

import { ReactNode, useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"
import enLanding from "@/data/en/landingPage.json"
import idLanding from "@/data/id/landingPage.json"

type Testimonial = {
  content: string
  author: string
  role?: string
  title?: string
  avatar?: string
}

export default function Testimonials({
  marqueeWhenOverflow = true,
  forceMarquee = false,
}: {
  marqueeWhenOverflow?: boolean
  forceMarquee?: boolean
  cardHeight?: number
}) {
  const { language } = useLanguage()
  const t = language === "en" ? enLanding.testimonials : idLanding.testimonials

  const [items, setItems] = useState<Testimonial[]>([])
  const [MarqueeComp, setMarqueeComp] = useState<null | ((p: any) => ReactNode)>(null)

  // import dinamis data (tanpa fetch)
  useEffect(() => {
    ;(async () => {
      const mod = await import("@/data/testimonials.json")
      const data = (mod.default as any)?.items ?? (Array.isArray(mod.default) ? mod.default : [])
      setItems(data)
    })()
  }, [])

  const useMarquee = useMemo(
    () => forceMarquee || (marqueeWhenOverflow && items.length > 3),
    [forceMarquee, marqueeWhenOverflow, items.length]
  )

  // import dinamis marquee hanya saat diperlukan
  useEffect(() => {
    if (!useMarquee || MarqueeComp) return
    ;(async () => {
      const m = await import("react-fast-marquee")
      // simpan sebagai komponen fungsional
      setMarqueeComp(() => m.default as any)
    })()
  }, [useMarquee, MarqueeComp])

  const wrapperClass =
    items.length === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"

  return (
    <section id="testimonials" className="py-16 px-6 bg-white dark:bg-slate-900">
      <div className="mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl font-bold text-foreground mb-4">{t.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        {useMarquee && MarqueeComp ? (
          <MarqueeComp pauseOnHover gradient={false} speed={40}>
            <div className="flex gap-6 pr-6">
              {items.map((it, i) => (
                <Card
                  key={i}
                  className="w-96 shrink-0 relative bg-card text-card-foreground border-border hover:shadow-lg transition-shadow h-[50vh]"
                >
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Profil di atas */}
                    <div className="flex items-center gap-4 mb-6">
                      <Avatar className="ring-1 ring-border">
                        <AvatarImage src={it.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-muted text-foreground">
                          {(it.author || "").split(" ").map(n => n[0]).join("").slice(0, 3)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-foreground">{it.author}</h4>
                        {it.role && <p className="text-sm text-muted-foreground">{it.role}</p>}
                        {it.title && <p className="text-xs text-muted-foreground/80">{it.title}</p>}
                      </div>
                    </div>

                    {/* Teks testimoni */}
                    <div className="relative flex-1">
                      <Quote className="absolute -top-2 right-0 w-8 h-8 text-blue-200/60 dark:text-blue-300/30" />
                      <p className="italic leading-relaxed text-muted-foreground pr-10 overflow-hidden">
                        “{it.content}”
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </MarqueeComp>
        ) : (
          <div className={wrapperClass}>
            {items.map((it, i) => (
              <Card
                key={i}
                className="relative bg-card text-card-foreground border-border hover:shadow-lg transition-shadow h-[50vh]"
              >
                <CardContent className="p-6 h-full flex flex-col ">
                  {/* Profil di atas */}
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="ring-1 ring-border">
                      <AvatarImage src={it.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="bg-muted text-foreground">
                        {(it.author || "").split(" ").map(n => n[0]).join("").slice(0, 3)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{it.author}</h4>
                      {it.role && <p className="text-sm text-muted-foreground">{it.role}</p>}
                      {it.title && <p className="text-xs text-muted-foreground/80">{it.title}</p>}
                    </div>
                  </div>

                  {/* Teks testimoni */}
                  <div className="relative flex-1">
                    <Quote className="absolute -top-2 right-0 w-8 h-8 text-blue-200/60 dark:text-blue-300/30" />
                    <p className="italic leading-relaxed text-muted-foreground pr-10 overflow-hidden">
                      “{it.content}”
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
