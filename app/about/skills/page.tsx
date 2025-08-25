"use client"

import React, { useEffect, useCallback } from "react"
import Image from "next/image"
import type { IconType } from "react-icons"
import skills from "@/data/skills.json"
import * as RiIcons from "react-icons/ri"
import * as SiIcons from "react-icons/si"
import { useLanguage } from "@/contexts/LanguageContext"

// Mapping icon libraries
const riMap = RiIcons as Record<string, IconType>
const siMap = SiIcons as Record<string, IconType>

interface DynamicIconProps {
  iconPath: string
  label: string
  size?: number
  className?: string
}

function DynamicIcon({ iconPath, label, size = 32, className }: DynamicIconProps) {
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

// Custom particle component for creative blue theme
function ParticleBackground() {
  const createParticle = useCallback(() => {
    const shapes = ["square", "triangle", "hexagon", "diamond", "plus"]
    const colors = ["#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#2563eb"]

    return {
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    }
  }, [])

  const [particles, setParticles] = React.useState(() => Array.from({ length: 20 }, createParticle))

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x: (particle.x + particle.speedX + 100) % 100,
          y: (particle.y + particle.speedY + 100) % 100,
          rotation: particle.rotation + particle.rotationSpeed,
        })),
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const getShapeStyle = (particle: any) => {
    const baseStyle = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      opacity: particle.opacity,
      transform: `rotate(${particle.rotation}deg)`,
      transition: "transform 0.1s linear",
    }

    switch (particle.shape) {
      case "square":
        return { ...baseStyle, borderRadius: "2px" }
      case "triangle":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderLeft: `${particle.size / 2}px solid transparent`,
          borderRight: `${particle.size / 2}px solid transparent`,
          borderBottom: `${particle.size}px solid ${particle.color}`,
          width: "0",
          height: "0",
        }
      case "hexagon":
        return {
          ...baseStyle,
          clipPath: "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)",
          borderRadius: "0",
        }
      case "diamond":
        return { ...baseStyle, transform: `rotate(${particle.rotation + 45}deg)`, borderRadius: "2px" }
      case "plus":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          position: "relative" as const,
        }
      default:
        return { ...baseStyle, borderRadius: "50%" }
    }
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div key={particle.id} className="absolute">
          {particle.shape === "plus" ? (
            <div
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                transform: `rotate(${particle.rotation}deg)`,
                opacity: particle.opacity,
              }}
              className="absolute"
            >
              <div
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size / 4}px`,
                  backgroundColor: particle.color,
                  position: "absolute",
                  top: `${particle.size / 2 - particle.size / 8}px`,
                }}
              />
              <div
                style={{
                  width: `${particle.size / 4}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  position: "absolute",
                  left: `${particle.size / 2 - particle.size / 8}px`,
                }}
              />
            </div>
          ) : (
            <div className="absolute particle-modern" style={getShapeStyle(particle)} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function SkillsPage() {
  const { t } = useLanguage()
  const skillsData = t("skillsPage")

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      {/* Creative particle background */}
      <ParticleBackground />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Skills sections */}
        <div className="space-y-12">
          {Object.entries(skills).map(([category, items], categoryIndex) => (
            <section key={category} className="stagger-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {skillsData.categories[category] || category}
                </h2>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {items.map((item, itemIndex) => {
                  const [[key, iconPath]] = Object.entries(item)
                  return (
                    <div
                      key={key}
                      className="skill-card-hover bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-100 dark:border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center text-center group hover:bg-blue-50/80 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300"
                      style={{ animationDelay: `${categoryIndex * 0.1 + itemIndex * 0.05}s` }}
                    >
                      <div className="skill-icon-glow mb-3 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                        <DynamicIcon iconPath={iconPath} label={key} size={32} />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {key}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
