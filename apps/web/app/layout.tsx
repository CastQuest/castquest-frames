import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>CastQuest | Decentralized Protocol Universe</title>
        <meta name="description" content="Create, Cast, and Conquer in the Sovereign Web3 Media Hub. Powered by Farcaster, Zora, Solana, and BASE." />
      </head>
      <body className="bg-black text-neutral-100 antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                CastQuest
              </a>
              <div className="hidden md:flex gap-6 text-sm">
                <a href="/" className="text-neutral-400 hover:text-emerald-400 transition-colors">
                  Home
                </a>
                <a href="/frames" className="text-neutral-400 hover:text-emerald-400 transition-colors">
                  Frames
                </a>
                <a href="/quests" className="text-neutral-400 hover:text-emerald-400 transition-colors">
                  Quests
                </a>
                <a href="/dashboard" className="text-neutral-400 hover:text-emerald-400 transition-colors">
                  Dashboard
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="/admin/dashboard" 
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-neutral-700 text-neutral-300 hover:border-emerald-500/30 hover:text-emerald-400 transition-all"
              >
                Operator
              </a>
              <button className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Connect Wallet
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-800 bg-black">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  CastQuest
                </h3>
                <p className="text-sm text-neutral-500">
                  Decentralized Protocol Universe powered by Neo Glow.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-300 mb-4">Protocol</h4>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li><a href="/frames" className="hover:text-emerald-400 transition-colors">Frames</a></li>
                  <li><a href="/quests" className="hover:text-emerald-400 transition-colors">Quests</a></li>
                  <li><a href="/mints" className="hover:text-emerald-400 transition-colors">Mints</a></li>
                  <li><a href="/media" className="hover:text-emerald-400 transition-colors">Media</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-300 mb-4">Integrations</h4>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li>🎭 Farcaster</li>
                  <li>⚡ Zora</li>
                  <li>◎ Solana</li>
                  <li>🔵 BASE</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-neutral-300 mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li><a href="/docs" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                  <li><a href="/api" className="hover:text-emerald-400 transition-colors">API</a></li>
                  <li><a href="/github" className="hover:text-emerald-400 transition-colors">GitHub</a></li>
                  <li><a href="/discord" className="hover:text-emerald-400 transition-colors">Discord</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-neutral-800 flex justify-between items-center text-sm text-neutral-500">
              <p>© 2025 CastQuest. Powered by Neo Glow Protocol.</p>
              <div className="flex gap-4">
                <a href="/terms" className="hover:text-emerald-400 transition-colors">Terms</a>
                <a href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
