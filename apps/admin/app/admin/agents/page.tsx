"use client"

import { useState, useEffect } from "react"
import { 
  Bot,
  Play,
  Pause,
  RefreshCw,
  Settings,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  Terminal,
  Zap,
  BarChart3
} from "lucide-react"

interface AgentConfig {
  id: string
  name: string
  description: string | null
  enabled: boolean
  config: Record<string, unknown>
  schedule: string | null
  lastRun: string | null
  lastResult: { status: string; message?: string } | null
}

interface AgentExecution {
  id: string
  agentId: string
  status: "pending" | "running" | "completed" | "failed"
  input: Record<string, unknown> | null
  output: Record<string, unknown> | null
  error: string | null
  duration: number | null
  triggeredBy: string
  startedAt: string
  completedAt: string | null
}

// Demo agents
const demoAgents: AgentConfig[] = [
  {
    id: "a1",
    name: "FramePricingAgent",
    description: "AI agent that analyzes market data and suggests optimal pricing for frame mints",
    enabled: true,
    config: { model: "gpt-4-turbo", maxTokens: 2000 },
    schedule: "0 */6 * * *",
    lastRun: "2024-03-15T18:00:00Z",
    lastResult: { status: "success", message: "Analyzed 150 frames, updated 23 pricing recommendations" },
  },
  {
    id: "a2",
    name: "ContentModerationAgent",
    description: "Scans uploaded media for policy violations and inappropriate content",
    enabled: true,
    config: { model: "gpt-4-vision", confidenceThreshold: 0.85 },
    schedule: "*/15 * * * *",
    lastRun: "2024-03-15T20:15:00Z",
    lastResult: { status: "success", message: "Reviewed 45 new uploads, flagged 2 for review" },
  },
  {
    id: "a3",
    name: "QuestCompletionAgent",
    description: "Validates quest completion criteria and triggers rewards distribution",
    enabled: true,
    config: { batchSize: 100, retryAttempts: 3 },
    schedule: "*/5 * * * *",
    lastRun: "2024-03-15T20:20:00Z",
    lastResult: { status: "success", message: "Processed 89 quest completions, distributed 2.5 ETH in rewards" },
  },
  {
    id: "a4",
    name: "AnalyticsAggregationAgent",
    description: "Aggregates platform metrics and generates daily reports",
    enabled: false,
    config: { reportFormat: "json", destinations: ["db", "s3"] },
    schedule: "0 0 * * *",
    lastRun: "2024-03-15T00:00:00Z",
    lastResult: { status: "failed", message: "S3 bucket write permission denied" },
  },
  {
    id: "a5",
    name: "SmartBrainOrchestrator",
    description: "Master agent that coordinates other agents and optimizes workflow execution",
    enabled: true,
    config: { maxConcurrency: 5, priorityQueue: true },
    schedule: "*/30 * * * *",
    lastRun: "2024-03-15T20:00:00Z",
    lastResult: { status: "success", message: "Orchestrated 12 agent runs, 100% success rate" },
  },
]

const demoExecutions: AgentExecution[] = [
  {
    id: "e1",
    agentId: "a3",
    status: "completed",
    input: { batchId: "b-123" },
    output: { processed: 89, rewards: "2.5 ETH" },
    error: null,
    duration: 4500,
    triggeredBy: "schedule",
    startedAt: "2024-03-15T20:20:00Z",
    completedAt: "2024-03-15T20:20:04Z",
  },
  {
    id: "e2",
    agentId: "a2",
    status: "completed",
    input: { scanType: "full" },
    output: { scanned: 45, flagged: 2 },
    error: null,
    duration: 12300,
    triggeredBy: "schedule",
    startedAt: "2024-03-15T20:15:00Z",
    completedAt: "2024-03-15T20:15:12Z",
  },
  {
    id: "e3",
    agentId: "a4",
    status: "failed",
    input: { reportDate: "2024-03-15" },
    output: null,
    error: "S3 bucket write permission denied",
    duration: 850,
    triggeredBy: "schedule",
    startedAt: "2024-03-15T00:00:00Z",
    completedAt: "2024-03-15T00:00:01Z",
  },
]

export default function AgentsPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([])
  const [executions, setExecutions] = useState<AgentExecution[]>([])
  const [loading, setLoading] = useState(true)
  const [runningAgents, setRunningAgents] = useState<Set<string>>(new Set())
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setAgents(demoAgents)
      setExecutions(demoExecutions)
      setLoading(false)
    }, 500)
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleAgent = (agentId: string, currentEnabled: boolean) => {
    setAgents(prev => prev.map(a => 
      a.id === agentId ? { ...a, enabled: !currentEnabled } : a
    ))
    showNotification("success", `Agent ${currentEnabled ? "disabled" : "enabled"}`)
  }

  const runAgent = async (agent: AgentConfig) => {
    setRunningAgents(prev => new Set(prev).add(agent.id))
    
    // Add pending execution
    const execution: AgentExecution = {
      id: `e${Date.now()}`,
      agentId: agent.id,
      status: "running",
      input: null,
      output: null,
      error: null,
      duration: null,
      triggeredBy: "manual",
      startedAt: new Date().toISOString(),
      completedAt: null,
    }
    setExecutions(prev => [execution, ...prev])

    // Simulate execution
    setTimeout(() => {
      const success = Math.random() > 0.2
      setExecutions(prev => prev.map(e => 
        e.id === execution.id
          ? {
              ...e,
              status: success ? "completed" : "failed",
              output: success ? { result: "Execution completed" } : null,
              error: success ? null : "Simulated error for demo",
              duration: Math.floor(Math.random() * 5000) + 1000,
              completedAt: new Date().toISOString(),
            }
          : e
      ))
      
      setAgents(prev => prev.map(a => 
        a.id === agent.id
          ? {
              ...a,
              lastRun: new Date().toISOString(),
              lastResult: success 
                ? { status: "success", message: "Manual execution completed" }
                : { status: "failed", message: "Simulated error" },
            }
          : a
      ))
      
      setRunningAgents(prev => {
        const next = new Set(prev)
        next.delete(agent.id)
        return next
      })
      
      showNotification(success ? "success" : "error", 
        success ? `${agent.name} completed successfully` : `${agent.name} failed`
      )
    }, 2000 + Math.random() * 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      case "running": return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
      case "failed": return <XCircle className="w-4 h-4 text-red-400" />
      default: return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getResultColor = (status: string | undefined) => {
    switch (status) {
      case "success": return "text-emerald-400"
      case "failed": return "text-red-400"
      default: return "text-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Agent Management
            </h1>
            <p className="text-slate-400 mt-1">Configure and monitor AI agents</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-lg border border-slate-700/50">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-300">
                {agents.filter(a => a.enabled).length}/{agents.length} Active
              </span>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            notification.type === "success" 
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}>
            {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Agents", value: agents.length, icon: Bot, color: "emerald" },
            { label: "Active", value: agents.filter(a => a.enabled).length, icon: Activity, color: "cyan" },
            { label: "Last Hour Runs", value: 24, icon: BarChart3, color: "purple" },
            { label: "Success Rate", value: "94%", icon: CheckCircle2, color: "green" },
          ].map((stat, i) => (
            <div key={i} className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-slate-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agents List */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                Configured Agents
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                Loading agents...
              </div>
            ) : (
              <div className="divide-y divide-slate-800">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className={`p-4 hover:bg-slate-800/30 transition-colors cursor-pointer ${
                      selectedAgent?.id === agent.id ? "bg-slate-800/50" : ""
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          agent.enabled ? "bg-emerald-500/20" : "bg-slate-700/50"
                        }`}>
                          <Bot className={`w-5 h-5 ${agent.enabled ? "text-emerald-400" : "text-slate-500"}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{agent.name}</div>
                          <div className="text-xs text-slate-500 mt-1">
                            {agent.schedule ? `Schedule: ${agent.schedule}` : "Manual only"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); runAgent(agent) }}
                          disabled={runningAgents.has(agent.id) || !agent.enabled}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          title="Run now"
                        >
                          {runningAgents.has(agent.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleAgent(agent.id, agent.enabled) }}
                          className={`p-2 rounded-lg transition-all ${
                            agent.enabled 
                              ? "text-emerald-400 hover:bg-emerald-500/10" 
                              : "text-slate-500 hover:bg-slate-700/50"
                          }`}
                          title={agent.enabled ? "Disable" : "Enable"}
                        >
                          {agent.enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {agent.lastResult && (
                      <div className={`mt-2 text-xs ${getResultColor(agent.lastResult.status)}`}>
                        Last: {agent.lastResult.message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Agent Details / Recent Executions */}
          <div className="space-y-6">
            {/* Selected Agent Details */}
            {selectedAgent && (
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    {selectedAgent.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedAgent.enabled 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-slate-700 text-slate-400"
                  }`}>
                    {selectedAgent.enabled ? "ACTIVE" : "DISABLED"}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">{selectedAgent.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Schedule</span>
                    <span className="text-white font-mono">{selectedAgent.schedule || "None"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Last Run</span>
                    <span className="text-white">
                      {selectedAgent.lastRun 
                        ? new Date(selectedAgent.lastRun).toLocaleString() 
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Config</span>
                    <span className="text-slate-300 font-mono text-xs">
                      {JSON.stringify(selectedAgent.config).slice(0, 50)}...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Executions */}
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  Recent Executions
                </h2>
              </div>

              <div className="divide-y divide-slate-800 max-h-[400px] overflow-y-auto">
                {executions.map((exec) => {
                  const agent = agents.find(a => a.id === exec.agentId)
                  return (
                    <div key={exec.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(exec.status)}
                          <span className="font-medium text-white">{agent?.name}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(exec.startedAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {exec.duration ? `${exec.duration}ms` : "In progress"}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-800 rounded">
                          {exec.triggeredBy}
                        </span>
                      </div>
                      {exec.error && (
                        <div className="mt-2 text-xs text-red-400 bg-red-500/10 p-2 rounded">
                          {exec.error}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
