import React, { ReactNode, HTMLAttributes } from "react"

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  elevated?: boolean
  glow?: boolean
}

export const Surface: React.FC<SurfaceProps> = ({
  children,
  elevated = false,
  glow = false,
  style,
  ...rest
}) => {
  return (
    <div
      style={{
        background: elevated ? "var(--neo-surface-elevated)" : "var(--neo-surface)",
        borderRadius: "var(--neo-radius-lg)",
        border: "1px solid var(--neo-border-subtle)",
        boxShadow: glow ? "var(--neo-shadow-soft)" : "none",
        padding: "var(--neo-space-lg)",
        color: "var(--neo-text-primary)",
        fontFamily: "var(--neo-font-body)",
        ...style
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
