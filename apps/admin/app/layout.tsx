// apps/admin/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import { ShellLayout } from "./components/ShellLayout";

export const metadata = {
  title: "CastQuest Operator Console",
  description: "Admin control surface for CastQuest protocol."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ShellLayout>
          <div className="cq-admin-shell">
            <aside className="cq-admin-sidebar">
              <div className="cq-admin-logo">OPERATOR</div>
              <nav className="cq-admin-nav">
                <a href="/" className="cq-admin-nav-item">Overview</a>
                <a href="/quests" className="cq-admin-nav-item">Quests</a>
                <a href="/frames" className="cq-admin-nav-item">Frames</a>
                <a href="/mints" className="cq-admin-nav-item">Mints</a>
                <a href="/brain" className="cq-admin-nav-item">Smart Brain</a>
                <a href="/systems" className="cq-admin-nav-item">Systems</a>
              </nav>
            </aside>

            <main className="cq-admin-main">
              {children}
            </main>
          </div>
        </ShellLayout>
      </body>
    </html>
  );
}