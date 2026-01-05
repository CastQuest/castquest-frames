"use client";

import { neo } from "@castquest/neo-ux-core";
import { DashboardGrid, DashboardStat } from "@castquest/neo-ux-core";

export default function TreasuryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-4xl font-bold ${neo.colors.text.primary} mb-2`}>
          Treasury 💎
        </h1>
        <p className={`text-lg ${neo.colors.text.secondary}`}>
          Manage your digital assets and earnings across multiple chains.
        </p>
      </div>

      <DashboardGrid columns={4}>
        <DashboardStat
          label="Total Balance"
          value="$1,234.56"
          trend="up"
          icon="💰"
          subtitle="+12.5% this week"
        />
        <DashboardStat
          label="ETH Balance"
          value="0.45"
          trend="up"
          icon="⟠"
          subtitle="Base L2"
        />
        <DashboardStat
          label="NFTs Owned"
          value="23"
          trend="neutral"
          icon="🖼️"
          subtitle="Cross-chain"
        />
        <DashboardStat
          label="XP Tokens"
          value="1,250"
          trend="up"
          icon="⭐"
          subtitle="Claimable"
        />
      </DashboardGrid>

      <div className="grid gap-6 md:grid-cols-2">
        <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
          <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {[
              { type: "Received", amount: "+0.05 ETH", time: "2 hours ago" },
              { type: "Mint", amount: "-0.01 ETH", time: "1 day ago" },
              { type: "Reward", amount: "+50 XP", time: "2 days ago" },
            ].map((tx, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded ${neo.colors.bg.tertiary}`}
              >
                <div>
                  <div className={`font-semibold ${neo.colors.text.primary}`}>{tx.type}</div>
                  <div className={`text-xs ${neo.colors.text.tertiary}`}>{tx.time}</div>
                </div>
                <div className={`font-bold ${neo.colors.text.accent}`}>{tx.amount}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-lg border ${neo.colors.border.default} ${neo.colors.bg.secondary}`}>
          <h3 className={`text-xl font-bold ${neo.colors.text.primary} mb-4`}>
            Chain Distribution
          </h3>
          <div className="space-y-4">
            {[
              { chain: "Base", amount: "0.35 ETH", percentage: 78 },
              { chain: "Ethereum", amount: "0.08 ETH", percentage: 18 },
              { chain: "Zora", amount: "0.02 ETH", percentage: 4 },
            ].map((chain) => (
              <div key={chain.chain}>
                <div className="flex items-center justify-between mb-2">
                  <span className={neo.colors.text.secondary}>{chain.chain}</span>
                  <span className={neo.colors.text.primary}>{chain.amount}</span>
                </div>
                <div className={`h-2 rounded-full ${neo.colors.bg.tertiary} overflow-hidden`}>
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    style={{ width: `${chain.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
