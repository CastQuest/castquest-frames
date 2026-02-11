import React, { ReactNode } from "react"

export interface NavbarLink {
  label: string
  href?: string
  active?: boolean
}

export interface NavbarProps {
  logo?: ReactNode
  links?: NavbarLink[]
  rightSlot?: ReactNode
}

export const Navbar: React.FC<NavbarProps> = ({ logo, links = [], rightSlot }) => {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(18px)",
        background:
          "linear-gradient(to right, rgba(2,3,10,0.92), rgba(5,8,24,0.92))",
        borderBottom: "1px solid rgba(255,255,255,0.06)"
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          fontFamily: "var(--neo-font-body)",
          color: "var(--neo-text-primary)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {logo}
        </div>
        <nav style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: "13px",
                color: link.active
                  ? "var(--neo-accent)"
                  : "var(--neo-text-secondary)",
                textDecoration: "none",
                padding: "4px 8px",
                borderRadius: "999px",
                background: link.active ? "rgba(0,245,255,0.12)" : "transparent"
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div>{rightSlot}</div>
      </div>
    </header>
  )
}
