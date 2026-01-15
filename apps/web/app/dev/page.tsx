import { ShellLayout } from "../../components/layout/ShellLayout";
import { Card } from "../../components/ui/Card";
import { Metric } from "../../components/ui/Metric";

export default function DevDashboardPage() {
  return (
    <ShellLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Dev Dashboard</h1>
          <p className="text-sm text-slate-400">API analytics, SDK usage, and integration tools</p>
        </div>

        {/* API Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card glow>
            <Metric label="API Requests" value="1.2M" hint="Last 24h" trend="up" />
          </Card>
          <Card>
            <Metric label="SDK Downloads" value="5,678" hint="Total" trend="up" />
          </Card>
          <Card>
            <Metric label="Active Integrations" value="234" hint="Live apps" />
          </Card>
          <Card>
            <Metric label="Avg Response Time" value="145ms" hint="p95 latency" />
          </Card>
        </div>

        {/* API Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Top API Endpoints" glow>
            <div className="space-y-3">
              {[
                { endpoint: "/api/frames/create", calls: "245K", success: "99.8%" },
                { endpoint: "/api/mints/mint", calls: "189K", success: "99.9%" },
                { endpoint: "/api/marketplace/list", calls: "156K", success: "99.7%" },
                { endpoint: "/api/quests/complete", calls: "134K", success: "99.6%" },
                { endpoint: "/api/brain/analyze", calls: "89K", success: "99.5%" },
              ].map((api) => (
                <div key={api.endpoint} className="fx-glass rounded-lg p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-300">{api.endpoint}</span>
                    <span className="text-[10px] text-emerald-400">{api.success}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{api.calls} calls</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="SDK Usage by Language">
            <div className="space-y-4">
              {[
                { lang: "TypeScript", usage: 45, color: "from-blue-500 to-blue-400" },
                { lang: "JavaScript", usage: 30, color: "from-yellow-500 to-yellow-400" },
                { lang: "Python", usage: 15, color: "from-green-500 to-green-400" },
                { lang: "Go", usage: 10, color: "from-cyan-500 to-cyan-400" },
              ].map((item) => (
                <div key={item.lang}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.lang}</span>
                    <span className="text-slate-400">{item.usage}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Error Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Recent Errors">
            <div className="space-y-2 text-xs">
              {[
                { code: "429", msg: "Rate limit exceeded", count: 45 },
                { code: "500", msg: "Internal server error", count: 12 },
                { code: "404", msg: "Resource not found", count: 234 },
                { code: "403", msg: "Forbidden", count: 8 },
              ].map((error) => (
                <div key={error.code} className="flex items-center justify-between fx-glass rounded-lg p-2">
                  <div>
                    <div className="font-semibold text-red-400">{error.code}</div>
                    <div className="text-[10px] text-slate-500">{error.msg}</div>
                  </div>
                  <div className="text-slate-400">{error.count}x</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Documentation Stats">
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Total Pages</span>
                <span className="text-slate-200">156</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Page Views</span>
                <span className="text-slate-200">45.6K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Search Queries</span>
                <span className="text-slate-200">8.9K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Code Examples</span>
                <span className="text-slate-200">234</span>
              </div>
              <button className="w-full mt-2 px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                View Full Docs
              </button>
            </div>
          </Card>

          <Card title="Quick Links" glow>
            <div className="space-y-2">
              <a
                href="/api/docs"
                className="block w-full px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-all"
              >
                📖 API Reference
              </a>
              <a
                href="/sdk"
                className="block w-full px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
              >
                📦 SDK Documentation
              </a>
              <a
                href="/examples"
                className="block w-full px-3 py-2 text-xs rounded-lg border border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
              >
                💻 Code Examples
              </a>
            </div>
          </Card>
        </div>

        {/* Integration Examples */}
        <Card title="Quick Start Code Snippets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="fx-glass rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-200 mb-2">Create a Frame</div>
              <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto">
{`import { FramesClient } from '@castquest/sdk';

const client = new FramesClient({
  apiKey: process.env.CASTQUEST_API_KEY
});

const frame = await client.create({
  title: "My Frame",
  image: "ipfs://...",
  buttons: ["Mint", "Share"]
});`}
              </pre>
            </div>

            <div className="fx-glass rounded-lg p-4">
              <div className="text-xs font-semibold text-slate-200 mb-2">Mint an Asset</div>
              <pre className="text-[10px] text-slate-400 font-mono overflow-x-auto">
{`import { MintController } from '@castquest/sdk';

const minter = new MintController();

const token = await minter.mint({
  type: "MEDIA",
  metadata: {
    name: "Artwork",
    description: "...",
    image: "ipfs://..."
  }
});`}
              </pre>
            </div>
          </div>
        </Card>

        {/* Webhook Status */}
        <Card title="Webhook Deliveries">
          <div className="space-y-2">
            {[
              { event: "frame.created", status: "Success", time: "2m ago" },
              { event: "mint.completed", status: "Success", time: "5m ago" },
              { event: "marketplace.sale", status: "Success", time: "12m ago" },
              { event: "quest.completed", status: "Failed", time: "18m ago" },
              { event: "frame.interacted", status: "Success", time: "25m ago" },
            ].map((webhook, i) => (
              <div key={i} className="flex items-center justify-between fx-glass rounded-lg p-2 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      webhook.status === "Success" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-slate-300 font-mono">{webhook.event}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={webhook.status === "Success" ? "text-emerald-400" : "text-red-400"}>
                    {webhook.status}
                  </span>
                  <span className="text-slate-500">{webhook.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ShellLayout>
  );
}
