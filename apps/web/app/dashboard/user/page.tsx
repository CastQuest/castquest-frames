import { ShellLayout } from "../../../components/layout/ShellLayout";
import { Card } from "../../../components/ui/Card";
import { Metric } from "../../../components/ui/Metric";

export default function UserDashboardPage() {
  return (
    <ShellLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">User Dashboard</h1>
          <p className="text-sm text-slate-400">Track your portfolio, MC, and yields across V1→V2→V3</p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card glow>
            <Metric label="Total MC" value="$42.5M" hint="V1→V2→V3" trend="up" />
          </Card>
          <Card>
            <Metric label="Your Balance" value="1,234 CAST" hint="Governance tokens" />
          </Card>
          <Card>
            <Metric label="Treasury Yield" value="4.2% APY" hint="Autonomous" trend="up" />
          </Card>
          <Card>
            <Metric label="Active Chains" value="12" hint="Base + L2s + L3s + Solana" />
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Market Cap (MC) — V1 → V2 → V3" glow>
            <div className="space-y-3">
              <div className="text-[10px] font-mono text-slate-400">
                MC = Σ(MEDIA + FRAM + GAME + CODE + SubDAO + L3) + buyback_multiplier
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">MEDIA Tokens</span>
                  <span className="font-semibold text-emerald-400">$12.3M</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">FRAM Tokens</span>
                  <span className="font-semibold text-purple-400">$8.7M</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">GAME Tokens</span>
                  <span className="font-semibold text-cyan-400">$6.2M</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">CODE Tokens</span>
                  <span className="font-semibold text-pink-400">$4.1M</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">SubDAOs</span>
                  <span className="font-semibold text-yellow-400">$7.8M</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">L3 Chains</span>
                  <span className="font-semibold text-blue-400">$2.4M</span>
                </div>
                <div className="flex justify-between text-xs pt-2 border-t border-slate-700">
                  <span className="text-slate-300 font-semibold">Buyback Multiplier</span>
                  <span className="font-bold text-emerald-300">1.08x</span>
                </div>
              </div>
            </div>
          </Card>
          
          <Card title="Token Balances">
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {[
                { token: "CAST", balance: "1,234", color: "text-purple-400" },
                { token: "QUEST", balance: "567", color: "text-emerald-400" },
                { token: "MEDIA", balance: "89", color: "text-cyan-400" },
                { token: "FRAM", balance: "45", color: "text-pink-400" },
                { token: "GAME", balance: "23", color: "text-yellow-400" },
                { token: "CODE", balance: "12", color: "text-blue-400" },
              ].map((item) => (
                <div key={item.token} className="flex justify-between px-2 py-2 rounded-md fx-glass">
                  <span className={`font-semibold ${item.color}`}>{item.token}</span>
                  <span className="text-slate-300">{item.balance}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Agent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Active Agents">
            <div className="space-y-2">
              {[
                { name: "CreationAgent", status: "Active", color: "bg-emerald-500" },
                { name: "PricingAgent", status: "Active", color: "bg-emerald-500" },
                { name: "UiAgent", status: "Active", color: "bg-emerald-500" },
                { name: "PortfolioAgent", status: "Active", color: "bg-emerald-500" },
              ].map((agent) => (
                <div key={agent.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${agent.color}`} />
                    <span className="text-slate-300">{agent.name}</span>
                  </div>
                  <span className="text-slate-500">{agent.status}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Minted MEDIA #123</span>
                <span className="text-slate-600">2h ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Listed on marketplace</span>
                <span className="text-slate-600">5h ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Received yield</span>
                <span className="text-slate-600">1d ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Voted on proposal</span>
                <span className="text-slate-600">2d ago</span>
              </div>
            </div>
          </Card>

          <Card title="Quick Actions" glow>
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                Create Asset
              </button>
              <button className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-all">
                Browse Marketplace
              </button>
              <button className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                View DAO Proposals
              </button>
            </div>
          </Card>
        </div>
      </div>
    </ShellLayout>
  );
}
