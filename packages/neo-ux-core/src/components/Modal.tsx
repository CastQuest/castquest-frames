import React, { ReactNode } from "react"

export interface ModalProps {
  open: boolean
  title?: string
  children: ReactNode
  onClose?: () => void
}

export const Modal: React.FC<ModalProps> = ({ open, title, children, onClose }) => {
  if (!open) return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50
      }}
      onClick={onClose}
    >
      <div
        style={{
          minWidth: "320px",
          maxWidth: "480px",
          background: "var(--neo-surface-elevated)",
          borderRadius: "var(--neo-radius-xl)",
          border: "1px solid var(--neo-border-subtle)",
          boxShadow: "var(--neo-shadow-hard)",
          padding: "var(--neo-space-lg)",
          color: "var(--neo-text-primary)",
          fontFamily: "var(--neo-font-body)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "8px"
            }}
          >
            <h2 style={{ fontSize: "16px", margin: 0 }}>{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--neo-text-muted)",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
              >
                ×
              </button>
            )}
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  )
}
