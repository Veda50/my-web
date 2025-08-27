export const skillsParticleConfig = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
      },
      onHover: {
        enable: true,
        mode: "repulse",
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ["#3b82f6", "#60a5fa", "#93c5fd"],
    },
    links: {
      color: "#3b82f6",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: {
        default: "bounce",
      },
      random: true,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 30,
    },
    opacity: {
      value: 0.3,
      random: true,
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 0.1,
        sync: false,
      },
    },
    shape: {
      type: ["circle", "triangle"],
    },
    size: {
      value: { min: 1, max: 4 },
      random: true,
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0.5,
        sync: false,
      },
    },
  },
  detectRetina: true,
}
