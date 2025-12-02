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
      vx: number
      vy: number
      opacity: number
      rotation: number
      rotationSpeed: number
      pulsePhase: number
      pulseSpeed: number
      twinklePhase: number
      twinkleSpeed: number
      life: number
      maxLife: number
      color: { r: number; g: number; b: number }
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
        { r: 147, g: 197, b: 253 },  // blue-300 - soft
        { r: 96, g: 165, b: 250 },   // blue-400
        { r: 59, g: 130, b: 246 },   // blue-500
        { r: 191, g: 219, b: 254 },  // blue-200 - very soft
      ]
      
      const starCount = 50 // Increased count for more twinkles
      
      for (let i = 0; i < starCount; i++) {
        lightStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 6 + 4, // 4-10px - larger stars
          vx: (Math.random() - 0.5) * 0.4, // Faster movement
          vy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.4, // 0.4-0.9 - more visible
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.04, // Faster rotation
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.05 + 0.03, // Faster pulse
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.08 + 0.04, // Faster twinkle
          life: Math.random() * 100,
          maxLife: 150 + Math.random() * 100, // Shorter life for faster twinkle
          color: blueColors[Math.floor(Math.random() * blueColors.length)],
        })
      }
    }

    // Draw a star shape
    const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number, rotation: number) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rotation)
      
      ctx.beginPath()
      
      for (let i = 0; i < spikes; i++) {
        // Outer point
        const angle1 = (i * 2 * Math.PI) / spikes
        const x1 = Math.cos(angle1) * outerRadius
        const y1 = Math.sin(angle1) * outerRadius
        
        // Inner point
        const angle2 = angle1 + Math.PI / spikes
        const x2 = Math.cos(angle2) * innerRadius
        const y2 = Math.sin(angle2) * innerRadius
        
        if (i === 0) {
          ctx.moveTo(x1, y1)
        } else {
          ctx.lineTo(x1, y1)
        }
        
        ctx.lineTo(x2, y2)
      }
      
      ctx.closePath()
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
        // Draw shiny stars for light mode
        lightStars.forEach((star) => {
          // Update life and fade in/out
          star.life++
          if (star.life > star.maxLife) {
            // Reset star
            star.x = Math.random() * canvas.width
            star.y = Math.random() * canvas.height
            star.life = 0
            star.opacity = Math.random() * 0.5 + 0.4
          }

          // Update position with faster drift
          star.x += star.vx
          star.y += star.vy

          // Bounce off edges
          if (star.x < 0) star.vx = Math.abs(star.vx)
          if (star.x > canvas.width) star.vx = -Math.abs(star.vx)
          if (star.y < 0) star.vy = Math.abs(star.vy)
          if (star.y > canvas.height) star.vy = -Math.abs(star.vy)

          // Update rotation
          star.rotation += star.rotationSpeed

          // Pulse effect
          star.pulsePhase += star.pulseSpeed
          const pulse = Math.sin(star.pulsePhase) * 0.3 + 0.9 // 0.6-1.2 scale

          // Twinkle effect
          star.twinklePhase += star.twinkleSpeed
          const twinkle = Math.sin(star.twinklePhase) * 0.4 + 0.6 // 0.2-1.0 scale

          // Fade based on life cycle - faster transition
          const lifeProgress = star.life / star.maxLife
          let lifeOpacity = star.opacity
          
          if (lifeProgress < 0.3) {
            // Faster fade in
            lifeOpacity *= (lifeProgress / 0.3)
          } else if (lifeProgress > 0.7) {
            // Faster fade out
            lifeOpacity *= (1 - (lifeProgress - 0.7) / 0.3)
          }

          // Combine pulse and twinkle effects
          const combinedEffect = pulse * twinkle
          const currentSize = star.size * combinedEffect
          const currentOpacity = lifeOpacity * combinedEffect
          
          // Calculate outer and inner radii for star shape
          const outerRadius = currentSize
          const innerRadius = currentSize * 0.5
          const spikes = 4 // 4-point star for diamond-like twinkle

          // Draw star with gradient
          ctx.save()
          ctx.translate(star.x, star.y)
          ctx.rotate(star.rotation)
          
          // Main star gradient
          const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius * 1.5)
          starGradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity})`)
          starGradient.addColorStop(0.5, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity * 0.6})`)
          starGradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`)
          
          drawStar(ctx, 0, 0, spikes, outerRadius, innerRadius, 0)
          ctx.fillStyle = starGradient
          ctx.fill()
          
          // Add white highlight for sparkle effect
          ctx.beginPath()
          ctx.arc(0, 0, currentSize * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`
          ctx.fill()
          
          // Add twinkle lines (small lines from center)
          ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity * 0.9})`
          ctx.lineWidth = currentSize * 0.15
          ctx.lineCap = 'round'
          
          // Draw 4 twinkle lines
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2
            const lineLength = currentSize * 0.8
            
            ctx.beginPath()
            ctx.moveTo(Math.cos(angle) * currentSize * 0.2, Math.sin(angle) * currentSize * 0.2)
            ctx.lineTo(Math.cos(angle) * lineLength, Math.sin(angle) * lineLength)
            ctx.stroke()
          }
          
          // Outer glow
          const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, outerRadius * 2.5)
          glowGradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity * 0.3})`)
          glowGradient.addColorStop(0.5, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity * 0.1})`)
          glowGradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`)
          
          ctx.fillStyle = glowGradient
          ctx.beginPath()
          ctx.arc(0, 0, outerRadius * 2, 0, Math.PI * 2)
          ctx.fill()
          
          ctx.restore()
        })
        
        // Occasionally spawn new stars for more dynamic effect
        if (Math.random() < 0.03 && lightStars.length < 70) {
          const blueColors = [
            { r: 147, g: 197, b: 253 },
            { r: 96, g: 165, b: 250 },
            { r: 59, g: 130, b: 246 },
          ]
          
          lightStars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 6 + 4,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.05 + 0.03,
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.08 + 0.04,
            life: 0,
            maxLife: 150 + Math.random() * 100,
            color: blueColors[Math.floor(Math.random() * blueColors.length)],
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