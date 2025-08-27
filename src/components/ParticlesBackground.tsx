"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

type Props = {
  className?: string;
  count?: number;
  speed?: number;
  colors?: string[];
};

export default function ParticlesBackground({
  className = "absolute inset-0 pointer-events-none z-10",
  count = 26,
  speed = 0.3,
  colors,
}: Props) {
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const inited = useRef(false);

  // init sekali
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // sync dark mode dari <html class="dark">
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    const obs = new MutationObserver(update);
    update();
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const palette = useMemo(
    () =>
      colors ??
      (isDark
        ? ["#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8", "#2563eb"]
        : ["#3b82f6", "#60a5fa", "#93c5fd", "#1d4ed8", "#2563eb"]),
    [colors, isDark]
  );

  const options: RecursivePartial<IOptions> = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: { value: "transparent" } },
      detectRetina: true,
      fpsLimit: 60,
      particles: {
        number: { value: count, density: { enable: true, area: 900 } },
        color: { value: palette },
        shape: {
          type: ["circle", "square", "triangle", "polygon"],
          options: { polygon: { sides: 6 } },
        },
        opacity: {
          value: { min: 0.12, max: 0.4 },
          animation: { enable: !reduced, speed: 0.2, sync: false },
        },
        size: { value: { min: 4, max: 10 } },
        rotate: {
          value: { min: 0, max: 360 },
          direction: "random",
          animation: { enable: !reduced, speed: 5, sync: false },
        },
        move: {
          enable: !reduced,
          speed: reduced ? 0 : speed,
          direction: "none",
          random: false,
          straight: false,
          outModes: { default: "bounce" },
        },
        links: { enable: false },
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: false, mode: [] },
          onClick: { enable: false, mode: [] },
          // ⬇️ perbaikan di sini: bukan boolean, tapi object
          resize: { enable: true },
        },
      },
    }),
    [count, speed, palette, reduced]
  );

  if (!ready) return null;

  return <Particles id="skillsParticles" options={options} className={className} />;
}
