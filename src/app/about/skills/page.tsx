// app/skills/page.tsx (atau file halaman Skills-mu)
"use client";

import React, { useMemo } from "react";
import type { IconType } from "react-icons";
import * as RiIcons from "react-icons/ri";
import * as SiIcons from "react-icons/si";
import Image from "next/image";

import { useLanguage } from "@/contexts/LanguageContext";
import ParticlesBackground from "@/components/ParticlesBackground";

import rawSkills from "@/data/skills.json";
import type { SkillsData, SkillItem } from "@/constant/type";

const riMap = RiIcons as Record<string, IconType>;
const siMap = SiIcons as Record<string, IconType>;

type DynamicIconProps = { iconPath: string; label: string; size?: number; className?: string };

function DynamicIcon({ iconPath, label, size = 32, className }: DynamicIconProps) {
  const parts = iconPath.split("/");
  if (parts[0] === "react-icon") {
    const [, lib, comp] = parts;
    const IconComp = lib === "ri" ? riMap[comp] : siMap[comp];
    return IconComp ? <IconComp size={size} className={className} title={label} /> : null;
  }
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image src={`/icons/${iconPath}`} alt={label} fill sizes={`${size}px`} style={{ objectFit: "contain" }} />
    </div>
  );
}

export default function SkillsPage() {
  const { t, language } = useLanguage();
  const copy = t("skillsPage");

  // ⬇️ KUNCI PERBAIKAN: cast via unknown → SkillsData
  const skills = rawSkills as unknown as SkillsData;

  // entries: [category, SkillItem[]][]
  const entries = useMemo(() => Object.entries(skills), [skills]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <ParticlesBackground />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">{copy?.title ?? (language === "id" ? "Keahlian Saya" : "My Skills")}</h1>
          <p className="text-muted-foreground mt-1">
            {copy?.subtitle ?? (language === "id" ? "Teknologi & alat yang saya gunakan" : "Technologies & tools I use")}
          </p>
        </header>

        <div className="space-y-12">
          {entries.map(([category, items], ci) => (
            <section key={category} className="stagger-fade-in" style={{ animationDelay: `${ci * 0.06}s` }}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{copy?.categories?.[category] ?? category}</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {items.map((it: SkillItem, i) => {
                  const [[label, iconPath]] = Object.entries(it);
                  return (
                    <div
                      key={`${category}-${label}-${i}`}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-100 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center text-center hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300"
                      style={{ animationDelay: `${ci * 0.06 + i * 0.03}s` }}
                    >
                      <div className="mb-3 text-blue-600 dark:text-blue-400">
                        <DynamicIcon iconPath={iconPath} label={label} size={32} />
                      </div>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .stagger-fade-in {
          animation: fadeInUp 0.5s ease both;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 6px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
