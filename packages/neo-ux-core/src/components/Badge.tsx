import React from "react"

export type BadgeTone = "accent" | "success" | "danger" | "warning" | "neutral"

export interface BadgeProps {
  label: string
  tone?: BadgeTone
}

export const Badge: React.FC<BadgeProps> = ({ label, tone = "accent" }) => {
  const toneMap: Record<BadgeTone, React.CSSProperties> = {
    accent: {
      background: "var(--neo-accent-soft)",
      color: "var(--neo-accent)"
    },
    success: {
      background: "rgba(77, 255, 136, 0.16)",
      color: "var(--neo-success)"
    },
    danger: {
      background: "rgba(255, 51, 102, 0.16)",
      color: "var(--neo-danger)"
    },
    warning: {
      background: "rgba(255, 201, 77, 0.16)",
      color: "var(--neo-warning)"
    },
    neutral: {
      background: "rgba(255,255,255,0.06)",
      color: "var(--neo-text-secondary)"
    }
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "var(--neo-font-body)",
        ...toneMap[tone]
      }}
    >
      {label}
    </span>
  )
}
