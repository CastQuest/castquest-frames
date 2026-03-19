"use client"

import { useState, useEffect } from "react"
import { 
  Bot,
  Activity,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  BarChart3,
  Cpu,
  Zap,
  TrendingUp,
  AlertCircle
} from "lucide-react"

interface AgentStatus {
  id: string
  name: string
  status: "running" | "idle" | "error"
  lastRun: string | null
  successRate: number
  avgDuration: number
  runsToday: number
}

interface SystemMetrics {
  totalAgents: number
  activeAgents: number
  executionsToday: number
  overallSuccessRate: number
  avgResponseTime: number
  errorRate: number
}

// Demo data
const demoAgents: AgentStatus[] = [
  {
    id: "a1",
    name: "FramePricingAgent",
    status: "idle",
    lastRun: "2024-03-15T18:00:00Z",
    successRate: 98.5,
    avgDuration: 2340,
    runsToday: 4,
  },
  {
    id: "a2",
    name: "ContentModerationAgent",
    status: "running",
    lastRun: "2024-03-15T20:28:00Z",
    successRate: 99.2,
    avgDuration: 8500,
    runsToday: 96,
  },
  {
    id: "a3",
    name: "QuestCompletionAgent",
    status: "idle",
    lastRun: "2024-03-15T20:25:00Z",
    successRate: 94.8,
    avgDuration: 3200,
    runsToday: 288,
  },
  {
    id: "a4",
    name: "AnalyticsAggregationAgent",
    status: "error",
    lastRun: "2024-03-15T00:00:00Z",
    successRate: 67.0,
    avgDuration: 45000,
    runsToday: 0,
  },
  {
    id: "a5",
    name: "SmartBrainOrchestrator",
    status: "idle",
    lastRun: "2024-03-15T20:00:00Z",
    successRate: 100,
    avgDuration: 1200,
    runsToday: 48,
  },
]

const demoMetrics: SystemMetrics = {
  totalAgents: 5,
  activeAgents: 4,
  executionsToday: 436,
  overallSuccessRate: 94.2,
  avgResponseTime: 3450,
  errorRate: 2.3,
}

export default function DevAgentsPage() {
  const [agents, setAgents] = useState<AgentStatus[]>([])
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    const loadData = () => {
      // Simulate real-time updates
      const updatedAgents = demoAgents.map(agent => ({
        ...agent,
        runsToday: agent.runsToday + (Math.random() > 0.7 ? 1 : 0),
        status: Math.random() > 0.9 
          ? (agent.status === "idle" ? "running" : "idle")
          : agent.status,
      })) as AgentStatus[]
      
      setAgents(updatedAgents)
      setMetrics({
        ...demoMetrics,
        executionsToday: demoMetrics.executionsToday + Math.floor(Math.random() * 3),
      })
      setLoading(false)
    }

    loadData()

    // Auto-refresh every 5 seconds
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(loadData, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-cyan-400 bg-cyan-400/10"
      case "idle": return "text-emerald-400 bg-emerald-400/10"
      case "error": return "text-red-400 bg-red-400/10"
      default: return "text-slate-400 bg-slate-400/10"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Loader2 className="w-4 h-4 animate-spin" />
      case "idle": return <CheckCircle2 className="w-4 h-4" />
      case "error": return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return "text-emerald-400"
    if (rate >= 80) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Agent Monitoring
            </h1>
            <p className="text-slate-400 mt-1">Real-time status of AI agents and Smart Brain system</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-slate-300">Auto-refresh</span>
            </label>
            <button
              onClick={() => setLoading(true)}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* System Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total Agents", value: metrics.totalAgents, icon: Bot, color: "emerald" },
              { label: "Active", value: metrics.activeAgents, icon: Zap, color: "cyan" },
              { label: "Runs Today", value: metrics.executionsToday, icon: Activity, color: "purple" },
              { label: "Success Rate", value: `${metrics.overallSuccessRate}%`, icon: TrendingUp, color: "green" },
              { label: "Avg Response", value: `${(metrics.avgResponseTime / 1000).toFixed(1)}s`, icon: Clock, color: "blue" },
              { label: "Error Rate", value: `${metrics.errorRate}%`, icon: AlertCircle, color: "red" },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Smart Brain Status */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Smart Brain Status</h2>
              <p className="text-sm text-slate-400">Multi-agent AI orchestration system</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Queue Depth</div>
              <div className="text-xl font-semibold text-white">12</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Processing</div>
              <div className="text-xl font-semibold text-cyan-400">3</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Completed</div>
              <div className="text-xl font-semibold text-emerald-400">1,247</div>
            </div>
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="text-sm text-slate-400 mb-1">Uptime</div>
              <div className="text-xl font-semibold text-white">99.98%</div>
            </div>
          </div>
        </div>

        {/* Agent Status Grid */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              Agent Status
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              Loading agent status...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Run</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Success Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Runs Today</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-slate-400" />
                          </div>
                          <span className="font-medium text-white">{agent.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                          {getStatusIcon(agent.status)}
                          {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {agent.lastRun 
                          ? new Date(agent.lastRun).toLocaleTimeString()
                          : "Never"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono ${getSuccessRateColor(agent.successRate)}`}>
                          {agent.successRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                        {(agent.avgDuration / 1000).toFixed(1)}s
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-slate-700/50 rounded text-sm text-white font-mono">
                          {agent.runsToday}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Agent metrics refresh every 5 seconds. Visit the{" "}
            <a href="/admin/agents" className="text-emerald-400 hover:text-emerald-300">
              Admin Panel
            </a>{" "}
            to configure agents.
          </p>
        </div>
      </div>
    </div>
  )
}
