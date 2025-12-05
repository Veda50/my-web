"use client"

import { useEffect, useRef } from 'react'

interface ParticleBackgroundProps {
  isDark: boolean
}

export function ParticleBackground({ isDark }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Star properties for dark mode
    const stars: Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      opacity: number
      twinkleSpeed: number
      twinklePhase: number
    }> = []

    // Shiny stars for light mode
    const lightStars: Array<{
      x: number
      y: number
      size: number
      opacity: number
      life: number
      maxLife: number
      color: { r: number; g: number; b: number }
      type: 'small' | 'medium' | 'large'
      state: 'fadeIn' | 'visible' | 'fadeOut' | 'waiting'
      delayCounter: number
      delayMax: number
    }> = []

    // Initialize particles based on mode
    if (isDark) {
      // Create stars for dark mode
      const starCount = 200
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        })
      }
    } else {
      // Create shiny stars for light mode
      const blueColors = [
        { r: 147, g: 197, b: 253 },  // blue-300
        { r: 96, g: 165, b: 250 },   // blue-400
        { r: 59, g: 130, b: 246 },   // blue-500
        { r: 191, g: 219, b: 254 },  // blue-200
      ]
      
      // Pool bintang yang cukup tapi tidak terlalu banyak
      const starCount = 60
      
      for (let i = 0; i < starCount; i++) {
        const sizeRand = Math.random()
        let size, type: 'small' | 'medium' | 'large'
        
        // PERBAIKAN: Ukuran bintang diperbesar
        if (sizeRand < 0.4) {
          // 40% small stars - UKURAN DIPERBESAR
          size = Math.random() * 5 + 4 // 4-9px (dari 2-5px)
          type = 'small'
        } else if (sizeRand < 0.8) {
          // 40% medium stars - UKURAN DIPERBESAR
          size = Math.random() * 8 + 6 // 6-14px (dari 4-9px)
          type = 'medium'
        } else {
          // 20% large stars - UKURAN DIPERBESAR
          size = Math.random() * 10 + 8 // 8-18px (dari 6-13px)
          type = 'large'
        }
        
        // PERBAIKAN: Delay awal lebih panjang
        const delayMax = Math.random() * 150 + 100 // 100-250 frame delay
        
        lightStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: size,
          opacity: 0,
          life: 0,
          maxLife: 40 + Math.random() * 40, // Life yang lebih panjang
          color: blueColors[Math.floor(Math.random() * blueColors.length)],
          type: type,
          state: 'waiting',
          delayCounter: 0,
          delayMax: delayMax
        })
      }
    }

    // Draw the complete star with proper layering
    const drawShineStar = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
      color: { r: number; g: number; b: number },
      type: 'small' | 'medium' | 'large'
    ) => {
      ctx.save()
      ctx.translate(x, y)
      
      // Calculate dimensions based on star type
      const starSize = size
      const glowSize = starSize * (type === 'large' ? 2.2 : type === 'medium' ? 1.9 : 1.6)
      
      // 1. Draw outer glow (behind everything)
      const outerGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize)
      outerGlow.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.25})`)
      outerGlow.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.1})`)
      outerGlow.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`)
      
      ctx.beginPath()
      ctx.arc(0, 0, glowSize, 0, Math.PI * 2)
      ctx.fillStyle = outerGlow
      ctx.fill()
      
      // Diamond 1: Vertical diamond
      const d1Width = starSize * 0.15
      const d1Height = starSize * 0.7
      
      ctx.beginPath()
      ctx.moveTo(0, -d1Height)
      ctx.lineTo(d1Width, 0)
      ctx.lineTo(0, d1Height)
      ctx.lineTo(-d1Width, 0)
      ctx.closePath()
      
      // Fill diamond 1 dengan WHITE gradient yang solid
      const fillGradient1 = ctx.createRadialGradient(0, 0, 0, 0, 0, d1Height)
      fillGradient1.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.98})`)
      fillGradient1.addColorStop(0.4, `rgba(255, 255, 255, ${opacity * 0.9})`)
      fillGradient1.addColorStop(0.8, `rgba(255, 255, 255, ${opacity * 0.6})`)
      fillGradient1.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.3})`)
      
      ctx.fillStyle = fillGradient1
      ctx.fill()
      
      // Stroke diamond 1 dengan warna yang lebih terang
      const strokeWidth1 = Math.max(1, starSize * 0.08)
      ctx.lineWidth = strokeWidth1
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.8})`
      ctx.lineJoin = 'round'
      ctx.stroke()
      
      // Diamond 2: Horizontal diamond
      const d2Width = starSize * 0.7
      const d2Height = starSize * 0.15
      
      // Draw diamond 2
      ctx.beginPath()
      ctx.moveTo(0, -d2Height)
      ctx.lineTo(d2Width, 0)
      ctx.lineTo(0, d2Height)
      ctx.lineTo(-d2Width, 0)
      ctx.closePath()
      
      // Fill diamond 2 dengan WHITE gradient yang solid
      const fillGradient2 = ctx.createRadialGradient(0, 0, 0, 0, 0, d2Width)
      fillGradient2.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
      fillGradient2.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.95})`)
      fillGradient2.addColorStop(0.9, `rgba(255, 255, 255, ${opacity * 0.7})`)
      fillGradient2.addColorStop(1, `rgba(255, 255, 255, ${opacity * 0.4})`)
      
      ctx.fillStyle = fillGradient2
      ctx.fill()
      
      // Stroke diamond 2 dengan warna yang kuat
      const strokeWidth2 = Math.max(0.8, starSize * 0.07)
      ctx.lineWidth = strokeWidth2
      ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.9})`
      ctx.stroke()
      
      // Core yang lebih terang dan besar
      const coreSize = starSize * 0.22
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize * 2)
      coreGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`)
      coreGradient.addColorStop(0.4, `rgba(255, 255, 255, ${opacity * 0.9})`)
      coreGradient.addColorStop(0.8, `rgba(255, 255, 255, ${opacity * 0.5})`)
      coreGradient.addColorStop(1, `rgba(255, 255, 255, 0)`)
      
      ctx.beginPath()
      ctx.arc(0, 0, coreSize, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()
      
      // Sparkle lines untuk semua ukuran, tapi lebih tipis untuk small
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.9})`
      ctx.lineWidth = type === 'small' ? Math.max(0.5, starSize * 0.04) : Math.max(0.7, starSize * 0.06)
      ctx.lineCap = 'round'
      
      // Draw 4 main sparkle lines
      const mainSparkleLength = starSize * 0.9
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2
        ctx.beginPath()
        ctx.moveTo(
          Math.cos(angle) * coreSize * 0.5,
          Math.sin(angle) * coreSize * 0.5
        )
        ctx.lineTo(
          Math.cos(angle) * mainSparkleLength,
          Math.sin(angle) * mainSparkleLength
        )
        ctx.stroke()
      }
      
      ctx.restore()
    }

    // Animation
    let animationFrameId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isDark) {
        // Draw stars for dark mode
        stars.forEach((star) => {
          // Update position
          star.x += star.vx
          star.y += star.vy

          // Wrap around screen
          if (star.x < 0) star.x = canvas.width
          if (star.x > canvas.width) star.x = 0
          if (star.y < 0) star.y = canvas.height
          if (star.y > canvas.height) star.y = 0

          // Twinkle effect
          star.twinklePhase += star.twinkleSpeed
          const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5

          // Draw star
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`
          ctx.fill()

          // Add glow effect for larger stars
          if (star.radius > 1.2) {
            const gradient = ctx.createRadialGradient(
              star.x, star.y, 0, 
              star.x, star.y, star.radius * 3
            )
            gradient.addColorStop(0, `rgba(147, 197, 253, ${twinkle * 0.3})`)
            gradient.addColorStop(1, 'rgba(147, 197, 253, 0)')
            ctx.fillStyle = gradient
            ctx.fill()
          }
        })
      } else {
        // Background yang lebih gelap agar bintang lebih terlihat
        const bgGradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 1.5
        )
        bgGradient.addColorStop(0, 'rgba(219, 234, 254, 0.08)')
        bgGradient.addColorStop(0.7, 'rgba(219, 234, 254, 0.03)')
        bgGradient.addColorStop(1, 'rgba(219, 234, 254, 0)')
        
        ctx.fillStyle = bgGradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Update dan draw shiny stars
        lightStars.forEach((star) => {
          // State machine untuk animasi
          switch (star.state) {
            case 'waiting':
              star.delayCounter++
              if (star.delayCounter >= star.delayMax) {
                star.state = 'fadeIn'
                star.life = 0
                star.delayCounter = 0
              }
              break
              
            case 'fadeIn':
              star.life++
              // PERBAIKAN: Fade in lebih lambat
              const fadeInDuration = 25 // 25 frame (dari 15)
              if (star.life <= fadeInDuration) {
                // Easing in untuk fade yang lebih smooth
                const progress = star.life / fadeInDuration
                star.opacity = progress * progress // Quadratic easing in
              } else {
                star.state = 'visible'
                star.life = 0
              }
              break
              
            case 'visible':
              star.life++
              // PERBAIKAN: Visible lebih lama
              const visibleDuration = 25 + Math.random() * 15 // 25-40 frame (dari 10-20)
              if (star.life >= visibleDuration) {
                star.state = 'fadeOut'
                star.life = 0
              }
              break
              
            case 'fadeOut':
              star.life++
              // PERBAIKAN: Fade out lebih lambat
              const fadeOutDuration = 30 // 30 frame (dari 20)
              if (star.life <= fadeOutDuration) {
                // Easing out untuk fade yang lebih smooth
                const progress = star.life / fadeOutDuration
                star.opacity = 1 - (progress * progress) // Quadratic easing out
              } else {
                // Reset untuk siklus berikutnya
                star.state = 'waiting'
                star.opacity = 0
                star.life = 0
                star.delayCounter = 0
                star.delayMax = Math.random() * 200 + 150 // Delay lebih panjang: 150-350 frame
                // Pindah posisi untuk variasi
                star.x = Math.random() * canvas.width
                star.y = Math.random() * canvas.height
              }
              break
          }
          
          // Draw the star jika tidak dalam state waiting
          if (star.state !== 'waiting') {
            drawShineStar(
              ctx,
              star.x,
              star.y,
              star.size,
              star.opacity,
              star.color,
              star.type
            )
          }
        })
        
        // Tambahkan bintang baru secara berkala
        if (lightStars.length < 80 && Math.random() < 0.015) { // Rate spawn dikurangi
          const blueColors = [
            { r: 147, g: 197, b: 253 },
            { r: 96, g: 165, b: 250 },
            { r: 59, g: 130, b: 246 },
            { r: 191, g: 219, b: 254 },
          ]
          
          const sizeRand = Math.random()
          let size, type: 'small' | 'medium' | 'large'
          
          // Ukuran yang sama dengan inisialisasi awal
          if (sizeRand < 0.2) {
            size = Math.random() * 5 + 6 
            type = 'small'
          } else if (sizeRand < 0.6) {
            size = Math.random() * 8 + 8 
            type = 'medium'
          } else {
            size = Math.random() * 10 + 10 
            type = 'large'
          }
          
          const delayMax = Math.random() * 100 + 50 // 50-150 frame delay untuk yang baru
          
          lightStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: size,
            opacity: 0,
            life: 0,
            maxLife: 50 + Math.random() * 50, // Life yang lebih panjang
            color: blueColors[Math.floor(Math.random() * blueColors.length)],
            type: type,
            state: 'waiting',
            delayCounter: 0,
            delayMax: delayMax
          })
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}