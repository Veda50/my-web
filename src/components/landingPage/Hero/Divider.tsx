import { useEffect, useRef } from 'react';

interface DividerProps {
  isDark: boolean;
}

export function Divider({ isDark }: DividerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 200;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fading particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      vx: number;
      opacity: number;
      fadeOut: number;
      twinklePhase: number;
      twinkleSpeed: number;
      color: { r: number; g: number; b: number };
    }> = [];

    // Create fewer particles that fade out
    const particleCount = 25;
    const blueColors = [
      { r: 59, g: 130, b: 246 },
      { r: 96, g: 165, b: 250 },
      { r: 147, g: 197, b: 253 },
    ];

    for (let i = 0; i < particleCount; i++) {
      const yPosition = Math.random() * canvas.height;
      // Particles at bottom have lower opacity (fade out effect)
      const fadeOut = 1 - (yPosition / canvas.height) * 0.8;

      particles.push({
        x: Math.random() * canvas.width,
        y: yPosition,
        size: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 * fadeOut,
        fadeOut: fadeOut,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        color: blueColors[Math.floor(Math.random() * blueColors.length)],
      });
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background for smooth transition
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDark) {
        bgGradient.addColorStop(0, 'rgba(15, 23, 42, 0)'); // transparent
        bgGradient.addColorStop(1, 'rgba(15, 23, 42, 1)'); // slate-900
      } else {
        bgGradient.addColorStop(0, 'rgba(255, 255, 255, 0)'); // transparent
        bgGradient.addColorStop(1, 'rgba(255, 255, 255, 1)'); // white
      }
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw fading particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.twinklePhase += particle.twinkleSpeed;

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;

        const twinkle = Math.sin(particle.twinklePhase) * 0.5 + 0.5;
        const currentOpacity = particle.opacity * twinkle * particle.fadeOut;

        if (!isDark) {
          // Light mode - blue sparkles fading out
          ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${currentOpacity})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Dark mode - white sparkles fading out
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.8})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="relative w-full h-[200px] overflow-hidden">
      {/* Wave SVG for organic transition */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 1200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="rgba(15, 23, 42, 0)" />
                <stop offset="100%" stopColor="rgb(15, 23, 42)" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="100%" stopColor="rgb(255, 255, 255)" />
              </>
            )}
          </linearGradient>
        </defs>
        <path
          d="M0,50 Q300,20 600,50 T1200,50 L1200,200 L0,200 Z"
          fill="url(#waveGradient)"
          opacity="0.3"
        />
        <path
          d="M0,80 Q300,60 600,90 T1200,80 L1200,200 L0,200 Z"
          fill="url(#waveGradient)"
          opacity="0.5"
        />
        <path
          d="M0,120 Q300,100 600,120 T1200,120 L1200,200 L0,200 Z"
          fill="url(#waveGradient)"
          opacity="0.8"
        />
      </svg>

      {/* Canvas for fading particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Bottom solid background */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-[60px] ${
          isDark ? 'bg-slate-900' : 'bg-white'
        }`}
      />
    </div>
  );
}
