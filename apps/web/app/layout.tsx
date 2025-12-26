import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CastQuest",
  description: "Onchain social quests powered by Frames and Smart Brain."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="cq-body">
        <div className="cq-bg">
          <div className="cq-bg-grid" />
          <div className="cq-bg-orbit cq-bg-orbit--emerald" />
          <div className="cq-bg-orbit cq-bg-orbit--violet" />
        </div>

        <div className="cq-shell">
          <header className="cq-header">
            <div className="cq-logo">
              <span className="cq-logo-dot" />
              <div>
                <div className="cq-logo-title">CAST QUEST</div>
                <div className="cq-logo-sub">ONCHAIN OPERATOR CONSOLE</div>
              </div>
            </div>
            <nav className="cq-nav">
              <a href="/" className="cq-nav-item cq-nav-item--active">Feed</a>
              <a href="/quests" className="cq-nav-item">Quests</a>
              <a href="/mints" className="cq-nav-item">Mints</a>
              <a href="/profile" className="cq-nav-item">Profile</a>
            </nav>
          </header>

          <main className="cq-main">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}