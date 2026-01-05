import { neo } from "@castquest/neo-ux-core";

export default function APIPage() {
  return (
    <div className="min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold ${neo.colors.text.primary} mb-4`}>
            API Reference 🔌
          </h1>
          <p className={`text-xl ${neo.colors.text.secondary}`}>
            Interactive API documentation and playground.
          </p>
        </div>

        <div className={`p-8 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active} mb-8`}>
          <h2 className={`text-2xl font-bold ${neo.colors.text.primary} mb-4`}>Base URL</h2>
          <div className={`p-4 rounded-lg ${neo.colors.bg.tertiary} border ${neo.colors.border.default} font-mono text-sm ${neo.colors.text.accent}`}>
            https://api.castquest.io/v1
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { name: "Frames API", endpoints: 8, desc: "Create and manage Farcaster frames" },
            { name: "Quests API", endpoints: 6, desc: "Quest creation and completion tracking" },
            { name: "AI API", endpoints: 4, desc: "AI-powered frame generation" },
            { name: "Oracle API", endpoints: 5, desc: "On-chain data and treasury" },
          ].map((api) => (
            <div
              key={api.name}
              className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary} hover:${neo.colors.border.glow} transition-all`}
            >
              <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-2`}>{api.name}</h3>
              <p className={`text-sm ${neo.colors.text.secondary} mb-4`}>{api.desc}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${neo.colors.text.tertiary}`}>
                  {api.endpoints} endpoints
                </span>
                <button className={`px-4 py-2 rounded-lg border ${neo.colors.border.glow} ${neo.colors.text.accent} font-semibold hover:bg-emerald-500/10 transition-all`}>
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
