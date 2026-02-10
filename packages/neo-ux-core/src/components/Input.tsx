import React, { InputHTMLAttributes } from "react"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export const Input: React.FC<InputProps> = ({ label, hint, error, style, ...rest }) => {
  const hasError = Boolean(error)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
      {label && (
        <label
          style={{
            fontSize: "12px",
            color: "var(--neo-text-secondary)",
            fontFamily: "var(--neo-font-body)"
          }}
        >
          {label}
        </label>
      )}
      <input
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: "var(--neo-radius-md)",
          border: hasError
            ? "1px solid var(--neo-danger)"
            : "1px solid rgba(255,255,255,0.12)",
          background: "rgba(5, 8, 24, 0.9)",
          color: "var(--neo-text-primary)",
          fontFamily: "var(--neo-font-body)",
          fontSize: "14px",
          outline: "none",
          boxShadow: hasError ? "0 0 0 1px rgba(255, 51, 102, 0.4)" : "none",
          ...style
        }}
        {...rest}
      />
      {error ? (
        <span style={{ fontSize: "11px", color: "var(--neo-danger)" }}>{error}</span>
      ) : hint ? (
        <span style={{ fontSize: "11px", color: "var(--neo-text-muted)" }}>{hint}</span>
      ) : null}
    </div>
  )
}
