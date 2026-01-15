import { ShellLayout } from "../../components/layout/ShellLayout";
import { Card } from "../../components/ui/Card";
import { Metric } from "../../components/ui/Metric";

export default function AdminDashboardPage() {
  return (
    <ShellLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-sm text-slate-400">Protocol metrics, agent oversight, and fee management</p>
        </div>

        {/* Protocol Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card glow>
            <Metric label="Protocol Revenue" value="$1.2M" hint="Last 30 days" trend="up" />
          </Card>
          <Card>
            <Metric label="Total Users" value="45,678" hint="All time" trend="up" />
          </Card>
          <Card>
            <Metric label="Active Agents" value="11/11" hint="All operational" />
          </Card>
          <Card>
            <Metric label="Treasury Value" value="$8.5M" hint="Multi-chain" trend="up" />
          </Card>
          <Card>
            <Metric label="Governance Props" value="23" hint="Active votes" />
          </Card>
        </div>

        {/* Agent Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Agent Performance" glow>
            <div className="space-y-3">
              {[
                { name: "CreationAgent", uptime: "99.9%", actions: "1,234", cost: "$45" },
                { name: "PricingAgent", uptime: "99.8%", actions: "5,678", cost: "$89" },
                { name: "AuctionAgent", uptime: "100%", actions: "234", cost: "$12" },
                { name: "UiAgent", uptime: "99.7%", actions: "890", cost: "$34" },
                { name: "PortfolioAgent", uptime: "99.9%", actions: "456", cost: "$23" },
              ].map((agent) => (
                <div key={agent.name} className="fx-glass rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{agent.name}</span>
                    <span className="text-[10px] text-emerald-400">{agent.uptime} uptime</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{agent.actions} actions</span>
                    <span>{agent.cost} gas cost</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Fee Distribution">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">QUEST Buybacks</span>
                  <span className="text-slate-200">50%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-1/2" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Treasury</span>
                  <span className="text-slate-200">30%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 w-[30%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">LP Incentives</span>
                  <span className="text-slate-200">20%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-[20%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chain Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Chain Activity">
            <div className="space-y-2">
              {[
                { chain: "Base L2", txs: "12,345", status: "Healthy" },
                { chain: "Optimism", txs: "5,678", status: "Healthy" },
                { chain: "Arbitrum", txs: "3,456", status: "Healthy" },
                { chain: "Solana", txs: "8,901", status: "Healthy" },
                { chain: "Creator L3s", txs: "1,234", status: "Healthy" },
              ].map((chain) => (
                <div key={chain.chain} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-300">{chain.chain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{chain.txs} txs</span>
                    <span className="text-emerald-400 text-[10px]">{chain.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Governance Overview">
            <div className="space-y-3">
              <div className="fx-glass rounded-lg p-2">
                <div className="text-xs text-slate-300 mb-1">Proposal #23</div>
                <div className="text-[10px] text-slate-500 mb-2">Adjust treasury allocation</div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-400">78% For</span>
                  <span className="text-red-400">22% Against</span>
                </div>
              </div>
              <div className="fx-glass rounded-lg p-2">
                <div className="text-xs text-slate-300 mb-1">Proposal #22</div>
                <div className="text-[10px] text-slate-500 mb-2">Enable new agent</div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-emerald-400">92% For</span>
                  <span className="text-red-400">8% Against</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="System Health" glow>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">API Uptime</span>
                <span className="text-emerald-400">99.97%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Smart Contracts</span>
                <span className="text-emerald-400">All Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Bridge Status</span>
                <span className="text-emerald-400">Operational</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Last Audit</span>
                <span className="text-slate-500">15 days ago</span>
              </div>
              <button className="w-full mt-2 px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-400 transition-all">
                Emergency Pause
              </button>
            </div>
          </Card>
        </div>

        {/* Recent Alerts */}
        <Card title="Recent Alerts & Notifications">
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-3 fx-glass rounded-lg p-3">
              <div className="text-lg">🟢</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-200">All agents operational</div>
                <div className="text-[10px] text-slate-500">Last checked: 2 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 fx-glass rounded-lg p-3">
              <div className="text-lg">🟡</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-200">High gas prices on Base</div>
                <div className="text-[10px] text-slate-500">Consider delaying non-urgent transactions</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ShellLayout>
  );
}
