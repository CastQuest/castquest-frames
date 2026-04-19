"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  Trash2, 
  RefreshCw,
  Search,
  AlertCircle,
  Check,
  Flag
} from "lucide-react"
import { getFeatureFlags, toggleFeatureFlag, createFeatureFlag, deleteFeatureFlag } from "../../../actions/feature-flags"

interface FeatureFlag {
  id: string
  key: string
  enabled: boolean
  description: string | null
  updatedAt?: string
}

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [savingFlags, setSavingFlags] = useState<Set<string>>(new Set())
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<{
    key: string
    description: string
    enabled: boolean
  }>()

  // Default flags for demo when DB is not connected
  const defaultFlags: FeatureFlag[] = [
    { id: "1", key: "WEB3_ENABLED", enabled: true, description: "Enable Web3 wallet features and blockchain interactions" },
    { id: "2", key: "AGENTS_ENABLED", enabled: true, description: "Enable AI agent workflows and automation" },
    { id: "3", key: "CONTRACT_DEPLOY_ENABLED", enabled: true, description: "Enable smart contract deployment features" },
    { id: "4", key: "QUESTS_ENABLED", enabled: true, description: "Enable quest system and rewards" },
    { id: "5", key: "FRAMES_V2_ENABLED", enabled: false, description: "Enable experimental Frames v2 features" },
    { id: "6", key: "ANALYTICS_ENABLED", enabled: true, description: "Enable analytics and usage tracking" },
  ]

  useEffect(() => {
    fetchFlags()
  }, [])

  const fetchFlags = async () => {
    setLoading(true)
    setError(null)
    try {
      const { flags: data } = await getFeatureFlags()
      setFlags(data)
    } catch {
      setFlags(defaultFlags)
    } finally {
      setLoading(false)
    }
  }

  const toggleFlag = async (key: string, currentEnabled: boolean) => {
    setSavingFlags(prev => new Set(prev).add(key))
    
    // Optimistic update
    setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: !currentEnabled } : f))
    
    try {
      const result = await toggleFeatureFlag(key, !currentEnabled)
      if (result.error) {
        setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: currentEnabled } : f))
        showNotification("error", result.error)
      } else {
        showNotification("success", `${key} ${!currentEnabled ? "enabled" : "disabled"}`)
      }
    } catch {
      setFlags(prev => prev.map(f => f.key === key ? { ...f, enabled: currentEnabled } : f))
      showNotification("error", "Failed to update flag")
    } finally {
      setSavingFlags(prev => {
        const next = new Set(prev)
        next.delete(key)
        return next
      })
    }
  }

  const createFlag = async (data: { key: string; description: string; enabled: boolean }) => {
    try {
      const result = await createFeatureFlag(data)
      if (result.error) {
        showNotification("error", result.error)
      } else if (result.flag) {
        setFlags(prev => [...prev, result.flag!])
        setShowAddForm(false)
        reset()
        showNotification("success", `Flag ${data.key} created`)
      }
    } catch {
      showNotification("error", "Failed to create flag")
    }
  }

  const deleteFlag = async (key: string) => {
    if (!confirm(`Delete flag "${key}"? This action cannot be undone.`)) return
    
    try {
      const result = await deleteFeatureFlag(key)
      if (result.error) {
        showNotification("error", result.error)
      } else {
        setFlags(prev => prev.filter(f => f.key !== key))
        showNotification("success", `Flag ${key} deleted`)
      }
    } catch {
      showNotification("error", "Failed to delete flag")
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const filteredFlags = flags.filter(f => 
    f.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Feature Flags
            </h1>
            <p className="text-slate-400 mt-1">Control feature availability across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchFlags}
              className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Add Flag
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            notification.type === "success" 
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border border-red-500/30 text-red-400"
          }`}>
            {notification.type === "success" ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {notification.message}
          </div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flags..."
            className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {/* Add Flag Form */}
        {showAddForm && (
          <div className="mb-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <h2 className="text-lg font-semibold text-white mb-4">Create New Feature Flag</h2>
            <form onSubmit={handleSubmit(createFlag)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Flag Key (UPPER_SNAKE_CASE)</label>
                  <input
                    {...register("key", { 
                      required: "Key is required",
                      pattern: {
                        value: /^[A-Z][A-Z0-9_]*$/,
                        message: "Must be UPPER_SNAKE_CASE"
                      }
                    })}
                    placeholder="MY_NEW_FEATURE"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                  {errors.key && <p className="text-red-400 text-sm mt-1">{errors.key.message}</p>}
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Description</label>
                  <input
                    {...register("description")}
                    placeholder="What does this flag control?"
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("enabled")}
                  id="enabled"
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="enabled" className="text-slate-300">Enable immediately</label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
                >
                  Create Flag
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); reset() }}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 font-semibold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-red-400 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Flags List */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              Loading flags...
            </div>
          ) : filteredFlags.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              {searchQuery ? "No flags match your search" : "No feature flags configured"}
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {filteredFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleFlag(flag.key, flag.enabled)}
                      disabled={savingFlags.has(flag.key)}
                      className={`p-1 rounded-lg transition-all ${
                        savingFlags.has(flag.key) ? "opacity-50 cursor-wait" : ""
                      }`}
                    >
                      {flag.enabled ? (
                        <ToggleRight className="w-10 h-10 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-slate-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white">{flag.key}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          flag.enabled 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : "bg-slate-700 text-slate-400"
                        }`}>
                          {flag.enabled ? "ENABLED" : "DISABLED"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">{flag.description || "No description"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteFlag(flag.key)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete flag"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{flags.length}</div>
            <div className="text-sm text-slate-400">Total Flags</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{flags.filter(f => f.enabled).length}</div>
            <div className="text-sm text-slate-400">Enabled</div>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-500">{flags.filter(f => !f.enabled).length}</div>
            <div className="text-sm text-slate-400">Disabled</div>
          </div>
        </div>
      </div>
    </div>
  )
}
