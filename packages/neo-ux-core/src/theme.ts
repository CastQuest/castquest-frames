export const neo = {
  glow: {
    warning: "shadow-[0_0_20px_rgba(255,200,0,0.7)]",
    idle: "shadow-[0_0_10px_rgba(0,255,255,0.3)]",
    active: "shadow-[0_0_15px_rgba(0,255,255,0.6)]",
    success: "shadow-[0_0_20px_rgba(16,185,129,0.6)]",
    error: "shadow-[0_0_20px_rgba(239,68,68,0.6)]",
    purple: "shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    emerald: "shadow-[0_0_15px_rgba(16,185,129,0.5)]",
  },
  colors: {
    bg: {
      primary: "bg-black",
      secondary: "bg-neutral-900",
      tertiary: "bg-neutral-800",
    },
    text: {
      primary: "text-neutral-100",
      secondary: "text-neutral-300",
      tertiary: "text-neutral-500",
      accent: "text-emerald-400",
      warning: "text-yellow-400",
      error: "text-red-400",
      success: "text-emerald-400",
      purple: "text-purple-400",
    },
    border: {
      default: "border-neutral-800",
      glow: "border-emerald-500/30",
      active: "border-cyan-500/50",
    }
  },
  animation: {
    pulse: "animate-pulse",
    spin: "animate-spin",
    bounce: "animate-bounce",
  },
  spacing: {
    card: "p-4 md:p-6",
    panel: "p-6 md:p-8",
    section: "space-y-4 md:space-y-6",
  }
};
