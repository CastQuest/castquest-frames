import React, { ButtonHTMLAttributes, ReactNode } from "react"

export type NeoButtonVariant = "primary" | "ghost" | "outline" | "danger"
export type NeoButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: NeoButtonVariant
  size?: NeoButtonSize
  fullWidth?: boolean
}

const sizeStyles: Record<NeoButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 10px", fontSize: "12px" },
  md: { padding: "8px 14px", fontSize: "14px" },
  lg: { padding: "10px 18px", fontSize: "15px" }
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  style,
  ...rest
}) => {
  const base: React.CSSProperties = {
    borderRadius: "var(--neo-radius-pill)",
    border: "1px solid transparent",
    fontFamily: "var(--neo-font-body)",
    fontWeight: 600,
    letterSpacing: "0.02em",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.16s ease-out",
    width: fullWidth ? "100%" : undefined
  }

  let variantStyles: React.CSSProperties = {}

  if (variant === "primary") {
    variantStyles = {
      background: "linear-gradient(120deg, var(--neo-accent), var(--neo-accent-strong))",
      color: "#02030A",
      boxShadow: "var(--neo-shadow-soft)"
    }
  } else if (variant === "ghost") {
    variantStyles = {
      background: "transparent",
      color: "var(--neo-text-secondary)",
      borderColor: "rgba(255,255,255,0.08)"
    }
  } else if (variant === "outline") {
    variantStyles = {
      background: "rgba(0,0,0,0.3)",
      color: "var(--neo-accent)",
      borderColor: "var(--neo-accent)"
    }
  } else if (variant === "danger") {
    variantStyles = {
      background: "rgba(255, 51, 102, 0.12)",
      color: "var(--neo-danger)",
      borderColor: "var(--neo-danger)"
    }
  }

  return (
    <button style={{ ...base, ...sizeStyles[size], ...variantStyles, ...style }} {...rest}>
      {children}
    </button>
  )
}
