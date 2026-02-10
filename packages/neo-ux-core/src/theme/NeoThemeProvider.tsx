import React, { ReactNode, useEffect } from "react"
import { neoColors, neoRadii, neoShadow, neoSpacing, neoTypography } from "./tokens"

export type NeoThemeProviderProps = {
  children: ReactNode
}

export const NeoThemeProvider: React.FC<NeoThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty("--neo-bg", neoColors.background)
    root.style.setProperty("--neo-surface", neoColors.surface)
    root.style.setProperty("--neo-surface-elevated", neoColors.surfaceElevated)
    root.style.setProperty("--neo-border-subtle", neoColors.borderSubtle)
    root.style.setProperty("--neo-border-strong", neoColors.borderStrong)
    root.style.setProperty("--neo-text-primary", neoColors.textPrimary)
    root.style.setProperty("--neo-text-secondary", neoColors.textSecondary)
    root.style.setProperty("--neo-text-muted", neoColors.textMuted)
    root.style.setProperty("--neo-accent", neoColors.accent)
    root.style.setProperty("--neo-accent-soft", neoColors.accentSoft)
    root.style.setProperty("--neo-accent-strong", neoColors.accentStrong)
    root.style.setProperty("--neo-danger", neoColors.danger)
    root.style.setProperty("--neo-success", neoColors.success)
    root.style.setProperty("--neo-warning", neoColors.warning)

    root.style.setProperty("--neo-radius-xs", neoRadii.xs)
    root.style.setProperty("--neo-radius-sm", neoRadii.sm)
    root.style.setProperty("--neo-radius-md", neoRadii.md)
    root.style.setProperty("--neo-radius-lg", neoRadii.lg)
    root.style.setProperty("--neo-radius-xl", neoRadii.xl)
    root.style.setProperty("--neo-radius-pill", neoRadii.pill)

    root.style.setProperty("--neo-shadow-soft", neoShadow.soft)
    root.style.setProperty("--neo-shadow-hard", neoShadow.hard)

    root.style.setProperty("--neo-space-xs", neoSpacing.xs)
    root.style.setProperty("--neo-space-sm", neoSpacing.sm)
    root.style.setProperty("--neo-space-md", neoSpacing.md)
    root.style.setProperty("--neo-space-lg", neoSpacing.lg)
    root.style.setProperty("--neo-space-xl", neoSpacing.xl)
    root.style.setProperty("--neo-space-xxl", neoSpacing.xxl)

    root.style.setProperty("--neo-font-body", neoTypography.fontFamily)
    root.style.setProperty("--neo-font-mono", neoTypography.mono)
  }, [])

  return <>{children}</>
}
