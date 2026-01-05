"use client";

import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function DeploymentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Deployment Tools 🚀
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Test and deploy your frames with our Foundry-style deployment suite.
        </p>
      </div>

      <DashboardGrid columns={3}>
        <DashboardStat
          label="Deployments"
          value="24"
          trend="up"
          icon="🚀"
          subtitle="This month"
        />
        <DashboardStat
          label="Success Rate"
          value="98.5%"
          trend="up"
          icon="✅"
          subtitle="Last 30 days"
        />
        <DashboardStat
          label="Gas Saved"
          value="$234"
          trend="up"
          icon="⛽"
          subtitle="Optimized"
        />
      </DashboardGrid>

      <div className="grid gap-4 md:grid-cols-3">
        <button className={`p-6 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left group`}>
          <div className="text-3xl mb-3">🧪</div>
          <div className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>Test Frame</div>
          <div className={`text-sm ${neo.colors.text.tertiary} group-hover:${neo.colors.text.secondary} transition-colors`}>
            Validate frame locally before deployment
          </div>
        </button>
        <button className={`p-6 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left group`}>
          <div className="text-3xl mb-3">🌍</div>
          <div className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>Deploy Testnet</div>
          <div className={`text-sm ${neo.colors.text.tertiary} group-hover:${neo.colors.text.secondary} transition-colors`}>
            Deploy to staging environment
          </div>
        </button>
        <button className={`p-6 rounded-lg ${neo.colors.bg.secondary} border ${neo.colors.border.default} hover:${neo.colors.border.glow} transition-all text-left group`}>
          <div className="text-3xl mb-3">🚀</div>
          <div className={`text-lg font-bold ${neo.colors.text.primary} mb-1`}>Deploy Mainnet</div>
          <div className={`text-sm ${neo.colors.text.tertiary} group-hover:${neo.colors.text.secondary} transition-colors`}>
            Go live on production chains
          </div>
        </button>
      </div>

      <div className={`p-6 rounded-lg border ${neo.colors.border.glow} bg-gradient-to-br from-purple-500/10 to-cyan-500/10 ${neo.glow.active}`}>
        <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>
          Recent Deployments
        </h3>
        <div className="space-y-3">
          {[
            { frame: "Interactive Poll", chain: "Base", status: "success", time: "2 hours ago" },
            { frame: "NFT Gallery", chain: "Zora", status: "success", time: "1 day ago" },
            { frame: "Quest Board", chain: "Base", status: "pending", time: "2 days ago" },
          ].map((deployment, i) => (
            <div
              key={i}
              className={`flex items-center justify-between p-4 rounded-lg ${neo.colors.bg.secondary}`}
            >
              <div>
                <div className={`font-semibold ${neo.colors.text.primary}`}>{deployment.frame}</div>
                <div className={`text-sm ${neo.colors.text.tertiary}`}>
                  {deployment.chain} • {deployment.time}
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  deployment.status === "success"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {deployment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
