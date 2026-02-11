import React, { ReactNode, HTMLAttributes } from "react"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: ReactNode
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  style,
  ...rest
}) => {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top left, rgba(0,245,255,0.12), transparent 55%), var(--neo-surface)",
        borderRadius: "var(--neo-radius-lg)",
        border: "1px solid var(--neo-border-subtle)",
        padding: "var(--neo-space-lg)",
        color: "var(--neo-text-primary)",
        fontFamily: "var(--neo-font-body)",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        ...style
      }}
      {...rest}
    >
      {(title || subtitle) && (
        <div style={{ marginBottom: "4px" }}>
          {title && (
            <div style={{ fontSize: "15px", fontWeight: 600 }}>{title}</div>
          )}
          {subtitle && (
            <div style={{ fontSize: "12px", color: "var(--neo-text-muted)" }}>{subtitle}</div>
          )}
        </div>
      )}
      <div>{children}</div>
      {footer && <div style={{ marginTop: "8px" }}>{footer}</div>}
    </div>
  )
}
