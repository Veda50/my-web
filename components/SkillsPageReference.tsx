"use client"

import { useEffect } from "react"
import Image from "next/image"
import type { IconType } from "react-icons"
import skills from "@/data/skills.json"
import * as RiIcons from "react-icons/ri"
import * as SiIcons from "react-icons/si"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadFull } from "tsparticles"
import type { ISourceOptions } from "@tsparticles/engine"
import particlesConfig from "@/lib/config/particle"

// Mapping icon libraries
const riMap = RiIcons as Record<string, IconType>
const siMap = SiIcons as Record<string, IconType>

interface DynamicIconProps {
  iconPath: string
  label: string
  size?: number
  className?: string
}

function DynamicIcon({ iconPath, label, size = 20, className }: DynamicIconProps) {
  const parts = iconPath.split("/")
  if (parts[0] === "react-icon") {
    const [, lib, comp] = parts
    const IconComp = lib === "ri" ? riMap[comp] : siMap[comp]
    return IconComp ? <IconComp size={size} className={className} /> : null
  }
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <Image
        src={`/icons/${iconPath}`}
        alt={label}
        fill
        sizes={`${size}px`}
        style={{ objectFit: "contain" }}
        className={className}
      />
    </div>
  )
}

export default function SkillsPage() {
  // setup tsParticles engine once
  type Engine = import("@tsparticles/engine").Engine
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine)
    })
  }, [])
  return (
    <div className="relative p-8">
      {/* Particles background */}
      <Particles options={particlesConfig as ISourceOptions} className="absolute inset-0 z-[-1] w-full h-full" />

      {/* Skills sections */}
      {Object.entries(skills).map(([category, items]) => (
        <section key={category} className="py-8 divide-y divide-gray-200 dark:divide-gray-700">
          <h2 className="text-2xl font-bold capitalize mb-6">{category}</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 pt-6">
            {items.map((item) => {
              const [[key, iconPath]] = Object.entries(item)
              return (
                <div
                  key={key}
                  className="flex-none flex flex-col items-center p-2 rounded-lg transition-all hover:shadow-lg hover:bg-white dark:hover:shadow-none dark:hover:bg-primary"
                >
                  <DynamicIcon iconPath={iconPath} label={key} />
                  <span className="mt-1 text-xs capitalize">{key}</span>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
