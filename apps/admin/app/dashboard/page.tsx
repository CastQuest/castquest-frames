'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Database,
  DollarSign,
  AlertCircle,
  Activity,
  Users,
  TrendingUp,
  Settings,
  Lock,
  Unlock,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Zap,
  Coins,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Pause,
  RefreshCw,
  Trash2,
  Edit,
  Plus,
  Crown,
  Flag,
  Target,
  Cpu,
  HardDrive,
  Network,
  Server,
  Gauge,
  AlertTriangle,
  Ban,
  UserCheck,
  UserX,
  FileText,
  Code,
  Layers,
  Box,
  Package,
  Wallet,
  Globe,
  MessageSquare,
  Radio,
  Sparkles,
  Brain,
  Image as ImageIcon,
  Video,
  Music,
  Flame,
  TrendingDown,
} from 'lucide-react';

interface TokenMetrics {
  symbol: string;
  name: string;
  holders: number;
  volume24h: number;
  tvl: number;
  priceChange24h: number;
  status: 'active' | 'paused' | 'flagged';
  category: string;
}

interface ProtocolMetrics {
  totalValueLocked: number;
  totalVolume24h: number;
  totalFees24h: number;
  activeTokens: number;
  totalUsers: number;
  castPrice: number;
  castMarketCap: number;
}

interface UserActivity {
  id: string;
  user: string;
  action: string;
  token: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

interface RiskAlert {
  id: string;
  type: 'spam' | 'manipulation' | 'security' | 'liquidity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  token: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'permissions' | 'fees' | 'risk' | 'monitoring'>('overview');
  const [protocolMetrics, setProtocolMetrics] = useState<ProtocolMetrics>({
    totalValueLocked: 15420000,
    totalVolume24h: 3240000,
    totalFees24h: 81000,
    activeTokens: 1247,
    totalUsers: 45230,
    castPrice: 2.45,
    castMarketCap: 24500000,
  });
  
  const [tokens, setTokens] = useState<TokenMetrics[]>([]);
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [protocolPaused, setProtocolPaused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Initialize mock data
  useEffect(() => {
    setTokens([
      { symbol: 'PIC', name: 'Picture Token', holders: 1234, volume24h: 450000, tvl: 890000, priceChange24h: 12.5, status: 'active', category: 'image' },
      { symbol: 'VID', name: 'Video Token', holders: 890, volume24h: 320000, tvl: 670000, priceChange24h: -5.2, status: 'active', category: 'video' },
      { symbol: 'AUDIO', name: 'Audio Token', holders: 567, volume24h: 180000, tvl: 340000, priceChange24h: 8.7, status: 'active', category: 'audio' },
      { symbol: 'MEME', name: 'Meme Token', holders: 2341, volume24h: 890000, tvl: 1200000, priceChange24h: 34.2, status: 'flagged', category: 'image' },
      { symbol: 'ART', name: 'Art Token', holders: 456, volume24h: 120000, tvl: 230000, priceChange24h: -2.1, status: 'active', category: 'image' },
    ]);

    setRecentActivity([
      { id: '1', user: '0x1234...5678', action: 'BUY', token: 'PIC', amount: 1000, timestamp: '2m ago', status: 'success' },
      { id: '2', user: '0x8765...4321', action: 'SELL', token: 'VID', amount: 500, timestamp: '5m ago', status: 'success' },
      { id: '3', user: '0x9999...1111', action: 'CREATE', token: 'AUDIO', amount: 10000, timestamp: '12m ago', status: 'success' },
      { id: '4', user: '0x2222...3333', action: 'BUY', token: 'MEME', amount: 2500, timestamp: '15m ago', status: 'pending' },
      { id: '5', user: '0x4444...5555', action: 'SELL', token: 'PIC', amount: 750, timestamp: '23m ago', status: 'failed' },
    ]);

    setRiskAlerts([
      { id: '1', type: 'spam', severity: 'high', token: 'MEME', description: 'Suspicious trading pattern detected', timestamp: '10m ago', resolved: false },
      { id: '2', type: 'manipulation', severity: 'critical', token: 'PUMP', description: 'Possible price manipulation', timestamp: '1h ago', resolved: false },
      { id: '3', type: 'liquidity', severity: 'medium', token: 'VID', description: 'Low liquidity warning', timestamp: '2h ago', resolved: true },
      { id: '4', type: 'security', severity: 'low', token: 'ART', description: 'Contract interaction anomaly', timestamp: '5h ago', resolved: true },
    ]);
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProtocolMetrics(prev => ({
        ...prev,
        totalVolume24h: prev.totalVolume24h + Math.floor(Math.random() * 10000),
        totalFees24h: prev.totalFees24h + Math.floor(Math.random() * 250),
        castPrice: prev.castPrice + (Math.random() - 0.5) * 0.1,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleProtocol = () => {
    setProtocolPaused(!protocolPaused);
  };

  const toggleTokenStatus = (symbol: string) => {
    setTokens(tokens.map(t => 
      t.symbol === symbol 
        ? { ...t, status: t.status === 'active' ? 'paused' : 'active' as any }
        : t
    ));
  };

  const resolveAlert = (id: string) => {
    setRiskAlerts(riskAlerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Shield className="w-10 h-10 text-purple-400" />
                Admin Console
              </h1>
              <p className="text-slate-400">CastQuest Protocol Management Dashboard</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
                {riskAlerts.filter(a => !a.resolved).length > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {riskAlerts.filter(a => !a.resolved).length}
                  </span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleProtocol}
                className={`px-4 py-2 rounded-lg text-white transition-all flex items-center gap-2 shadow-lg ${
                  protocolPaused
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-red-500/25'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-green-500/25'
                }`}
              >
                {protocolPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span className="hidden sm:inline">{protocolPaused ? 'Resume' : 'Pause'} Protocol</span>
              </motion.button>
            </div>
          </div>

          {/* Protocol Status Banner */}
          {protocolPaused && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-3"
            >
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div className="flex-1">
                <h3 className="text-white font-semibold">Protocol Paused</h3>
                <p className="text-red-300 text-sm">All trading and token creation is currently disabled</p>
              </div>
            </motion.div>
          )}

          {/* Navigation Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/20">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'tokens', label: 'Token Management', icon: Coins },
              { id: 'permissions', label: 'Permissions', icon: Lock },
              { id: 'fees', label: 'Fee Controls', icon: DollarSign },
              { id: 'risk', label: 'Risk Management', icon: AlertCircle },
              { id: 'monitoring', label: 'System Health', icon: Activity },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Protocol Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Value Locked', value: `$${(protocolMetrics.totalValueLocked / 1000000).toFixed(2)}M`, icon: Wallet, change: 8.5, color: 'purple' },
                { label: '24h Volume', value: `$${(protocolMetrics.totalVolume24h / 1000000).toFixed(2)}M`, icon: TrendingUp, change: 12.3, color: 'cyan' },
                { label: '24h Protocol Fees', value: `$${(protocolMetrics.totalFees24h / 1000).toFixed(0)}K`, icon: DollarSign, change: 15.7, color: 'green' },
                { label: 'Active Tokens', value: protocolMetrics.activeTokens.toLocaleString(), icon: Coins, change: 3.2, color: 'pink' },
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-${metric.color}-600/20 to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all`} />
                  <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 bg-gradient-to-br from-${metric.color}-500/20 to-pink-500/20 rounded-lg`}>
                        <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                      </div>
                      <div className="flex items-center gap-1 text-sm text-green-400">
                        <TrendingUp className="w-4 h-4" />
                        {metric.change}%
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{metric.value}</div>
                    <div className="text-slate-400 text-sm">{metric.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CAST Token Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Coins className="w-6 h-6 text-purple-400" />
                      CAST Token Overview
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Current Price</div>
                      <div className="text-3xl font-bold text-white">${protocolMetrics.castPrice.toFixed(2)}</div>
                      <div className="text-sm text-green-400 flex items-center gap-1 mt-1">
                        <ArrowUpRight className="w-4 h-4" />
                        +5.8% (24h)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-400 mb-2">Market Cap</div>
                      <div className="text-3xl font-bold text-white">${(protocolMetrics.castMarketCap / 1000000).toFixed(1)}M</div>
                      <div className="text-sm text-cyan-400 mt-1">10M Total Supply</div>
                    </div>
                  </div>
                  <div className="h-48 bg-slate-800/50 rounded-lg flex items-end justify-around p-4">
                    {[65, 72, 68, 85, 78, 92, 88, 95, 90, 98, 94, 100].map((height, idx) => (
                      <div key={idx} className="flex-1 mx-0.5">
                        <div
                          className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all hover:from-purple-400 hover:to-pink-400"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    User Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Total Users</span>
                      <span className="text-white font-semibold">{protocolMetrics.totalUsers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Active (24h)</span>
                      <span className="text-green-400 font-semibold">8,942</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">New (24h)</span>
                      <span className="text-cyan-400 font-semibold">+342</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Uptime</span>
                      <span className="text-green-400 font-semibold">99.9%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">Avg Response</span>
                      <span className="text-white font-semibold">45ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-sm">TPS</span>
                      <span className="text-cyan-400 font-semibold">234</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity & Risk Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className={`p-2 rounded-lg ${
                        activity.action === 'BUY' ? 'bg-green-500/20' :
                        activity.action === 'SELL' ? 'bg-red-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {activity.action === 'BUY' ? <ArrowUpRight className="w-4 h-4 text-green-400" /> :
                         activity.action === 'SELL' ? <ArrowDownRight className="w-4 h-4 text-red-400" /> :
                         <Plus className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold text-sm">{activity.action}</span>
                          <span className="text-purple-400 text-sm">{activity.token}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{activity.timestamp}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        activity.status === 'success' ? 'bg-green-500/20 text-green-400' :
                        activity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {activity.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Risk Alerts
                </h3>
                <div className="space-y-3">
                  {riskAlerts.filter(a => !a.resolved).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${
                      alert.severity === 'critical' ? 'bg-red-500/20 border-red-500/50' :
                      alert.severity === 'high' ? 'bg-orange-500/20 border-orange-500/50' :
                      alert.severity === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50' :
                      'bg-blue-500/20 border-blue-500/50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Flag className={`w-4 h-4 ${
                            alert.severity === 'critical' ? 'text-red-400' :
                            alert.severity === 'high' ? 'text-orange-400' :
                            alert.severity === 'medium' ? 'text-yellow-400' :
                            'text-blue-400'
                          }`} />
                          <span className="text-white font-semibold text-sm">{alert.token}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            alert.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                            alert.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                            alert.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-blue-500/30 text-blue-300'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-all"
                        >
                          Resolve
                        </button>
                      </div>
                      <p className="text-slate-300 text-sm mb-2">{alert.description}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{alert.type}</span>
                        <span>•</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Token Management Tab */}
        {activeTab === 'tokens' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search tokens..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                    <tr>
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">Token</th>
                      <th className="text-left p-4 text-slate-400 font-medium text-sm">Category</th>
                      <th className="text-right p-4 text-slate-400 font-medium text-sm">Holders</th>
                      <th className="text-right p-4 text-slate-400 font-medium text-sm">24h Volume</th>
                      <th className="text-right p-4 text-slate-400 font-medium text-sm">TVL</th>
                      <th className="text-right p-4 text-slate-400 font-medium text-sm">24h Change</th>
                      <th className="text-center p-4 text-slate-400 font-medium text-sm">Status</th>
                      <th className="text-center p-4 text-slate-400 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token, index) => (
                      <motion.tr
                        key={token.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-slate-800 hover:bg-slate-800/30 transition-all"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center ${
                              token.category === 'image' ? 'from-purple-500 to-pink-500' :
                              token.category === 'video' ? 'from-cyan-500 to-blue-500' :
                              'from-green-500 to-emerald-500'
                            }`}>
                              {token.category === 'image' ? <ImageIcon className="w-5 h-5 text-white" /> :
                               token.category === 'video' ? <Video className="w-5 h-5 text-white" /> :
                               <Music className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <div className="text-white font-semibold">{token.symbol}</div>
                              <div className="text-slate-400 text-sm">{token.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs capitalize">
                            {token.category}
                          </span>
                        </td>
                        <td className="p-4 text-right text-white">{token.holders.toLocaleString()}</td>
                        <td className="p-4 text-right text-white">${(token.volume24h / 1000).toFixed(0)}K</td>
                        <td className="p-4 text-right text-white">${(token.tvl / 1000).toFixed(0)}K</td>
                        <td className="p-4 text-right">
                          <span className={`flex items-center gap-1 justify-end ${
                            token.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {token.priceChange24h > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {Math.abs(token.priceChange24h).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            token.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            token.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {token.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleTokenStatus(token.symbol)}
                              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-all"
                            >
                              {token.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-slate-300 transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all">
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  Admin Roles
                </h3>
                <div className="space-y-3">
                  {[
                    { role: 'Super Admin', count: 2, permissions: 'Full Access' },
                    { role: 'Protocol Manager', count: 5, permissions: 'Protocol Settings' },
                    { role: 'Risk Manager', count: 3, permissions: 'Risk & Compliance' },
                    { role: 'Support', count: 8, permissions: 'User Support' },
                  ].map((roleData) => (
                    <div key={roleData.role} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all">
                      <div>
                        <div className="text-white font-semibold">{roleData.role}</div>
                        <div className="text-slate-400 text-sm">{roleData.permissions}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-purple-400 font-semibold">{roleData.count} users</span>
                        <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Permission Matrix
                </h3>
                <div className="space-y-2">
                  {[
                    'Pause Protocol',
                    'Adjust Fees',
                    'Manage Tokens',
                    'Access Analytics',
                    'User Management',
                    'Risk Controls',
                  ].map((permission) => (
                    <div key={permission} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                      <span className="text-slate-300 text-sm">{permission}</span>
                      <div className="flex items-center gap-2">
                        {['SA', 'PM', 'RM'].map((role) => (
                          <div key={role} className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                        ))}
                        <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Fee Controls Tab */}
        {activeTab === 'fees' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl border border-green-500/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Protocol Fee</h3>
                <div className="text-4xl font-bold text-white mb-1">2.5%</div>
                <div className="text-green-400 text-sm">Standard trading fee</div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl border border-purple-500/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Creator Fee</h3>
                <div className="text-4xl font-bold text-white mb-1">1.0%</div>
                <div className="text-purple-400 text-sm">Per token creation</div>
              </div>

              <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 backdrop-blur-xl border border-cyan-500/50 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-2">Liquidity Fee</h3>
                <div className="text-4xl font-bold text-white mb-1">0.3%</div>
                <div className="text-cyan-400 text-sm">LP provider rewards</div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">Fee Configuration</h3>
              <div className="space-y-6">
                {[
                  { name: 'Trading Fee', current: 2.5, min: 0.1, max: 5.0, category: 'Protocol' },
                  { name: 'Creation Fee', current: 1.0, min: 0.0, max: 3.0, category: 'Token' },
                  { name: 'Withdrawal Fee', current: 0.5, min: 0.0, max: 2.0, category: 'User' },
                ].map((fee) => (
                  <div key={fee.name} className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-white font-semibold">{fee.name}</div>
                        <div className="text-slate-400 text-sm">{fee.category} Fee</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-400">{fee.current}%</div>
                    </div>
                    <input
                      type="range"
                      min={fee.min}
                      max={fee.max}
                      step={0.1}
                      value={fee.current}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                      <span>{fee.min}%</span>
                      <span>{fee.max}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg shadow-purple-500/25">
                Update Fee Configuration
              </button>
            </div>
          </motion.div>
        )}

        {/* Risk Management Tab */}
        {activeTab === 'risk' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Active Alerts', value: riskAlerts.filter(a => !a.resolved).length, color: 'red', icon: AlertTriangle },
                { label: 'Flagged Tokens', value: tokens.filter(t => t.status === 'flagged').length, color: 'orange', icon: Flag },
                { label: 'Spam Detected', value: 23, color: 'yellow', icon: Ban },
                { label: 'Resolved (24h)', value: 45, color: 'green', icon: CheckCircle },
              ].map((stat) => (
                <div key={stat.label} className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-${stat.color}-500/50 transition-all`}>
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    <span className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</span>
                  </div>
                  <div className="text-slate-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI Risk Detection
                </h3>
                <div className="space-y-4">
                  {[
                    { name: 'Spam Detection', status: 'active', accuracy: 98 },
                    { name: 'Price Manipulation', status: 'active', accuracy: 95 },
                    { name: 'Wash Trading', status: 'active', accuracy: 92 },
                    { name: 'Rug Pull Detection', status: 'active', accuracy: 97 },
                  ].map((detector) => (
                    <div key={detector.name} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div>
                        <div className="text-white font-semibold text-sm">{detector.name}</div>
                        <div className="text-slate-400 text-xs">Accuracy: {detector.accuracy}%</div>
                      </div>
                      <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                        Active
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Flag Token', icon: Flag, color: 'orange' },
                    { label: 'Ban User', icon: UserX, color: 'red' },
                    { label: 'Pause Trading', icon: Pause, color: 'yellow' },
                    { label: 'Emergency Stop', icon: AlertTriangle, color: 'red' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      className={`p-4 bg-${action.color}-500/20 hover:bg-${action.color}-500/30 border border-${action.color}-500/50 rounded-lg text-${action.color}-400 transition-all flex flex-col items-center gap-2`}
                    >
                      <action.icon className="w-6 h-6" />
                      <span className="text-sm font-semibold">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">All Risk Alerts</h3>
              <div className="space-y-3">
                {riskAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border transition-all ${
                      alert.resolved
                        ? 'bg-slate-800/30 border-slate-700 opacity-60'
                        : alert.severity === 'critical' ? 'bg-red-500/20 border-red-500/50' :
                          alert.severity === 'high' ? 'bg-orange-500/20 border-orange-500/50' :
                          alert.severity === 'medium' ? 'bg-yellow-500/20 border-yellow-500/50' :
                          'bg-blue-500/20 border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-semibold">{alert.token}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            alert.severity === 'critical' ? 'bg-red-500/30 text-red-300' :
                            alert.severity === 'high' ? 'bg-orange-500/30 text-orange-300' :
                            alert.severity === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                            'bg-blue-500/30 text-blue-300'
                          }`}>
                            {alert.severity}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                            {alert.type}
                          </span>
                          {alert.resolved && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{alert.description}</p>
                        <div className="text-xs text-slate-400">{alert.timestamp}</div>
                      </div>
                      {!alert.resolved && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded text-xs transition-all"
                          >
                            Resolve
                          </button>
                          <button className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded text-xs transition-all">
                            Investigate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* System Health Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'CPU Usage', value: '42%', icon: Cpu, color: 'green', status: 'healthy' },
                { label: 'Memory', value: '68%', icon: HardDrive, color: 'yellow', status: 'warning' },
                { label: 'Network', value: '234 TPS', icon: Network, color: 'green', status: 'healthy' },
                { label: 'Database', value: '12ms', icon: Server, color: 'green', status: 'healthy' },
              ].map((metric) => (
                <div key={metric.label} className={`bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-4 hover:border-${metric.color}-500/50 transition-all`}>
                  <div className="flex items-center justify-between mb-3">
                    <metric.icon className={`w-5 h-5 text-${metric.color}-400`} />
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      metric.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                      metric.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-slate-400 text-sm">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  System Performance
                </h3>
                <div className="h-64 bg-slate-800/50 rounded-lg flex items-end justify-around p-4">
                  {[45, 52, 48, 65, 58, 72, 68, 75, 70, 78, 74, 82].map((height, idx) => (
                    <div key={idx} className="flex-1 mx-0.5">
                      <div
                        className="bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t transition-all hover:from-cyan-400 hover:to-blue-400"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-purple-400" />
                  Service Status
                </h3>
                <div className="space-y-3">
                  {[
                    { service: 'API Gateway', status: 'operational', latency: '45ms' },
                    { service: 'Smart Contracts', status: 'operational', latency: '2.1s' },
                    { service: 'Database', status: 'operational', latency: '12ms' },
                    { service: 'AI Brain Service', status: 'operational', latency: '180ms' },
                    { service: 'Media Storage', status: 'operational', latency: '95ms' },
                    { service: 'WebSocket Server', status: 'operational', latency: '8ms' },
                  ].map((service) => (
                    <div key={service.service} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-white font-medium text-sm">{service.service}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs">{service.latency}</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                          {service.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                System Logs
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20">
                {[
                  { time: '14:32:45', level: 'INFO', message: 'Token PIC trade executed successfully' },
                  { time: '14:32:42', level: 'INFO', message: 'New token created: MEME' },
                  { time: '14:32:38', level: 'WARN', message: 'High trading volume detected on VID' },
                  { time: '14:32:30', level: 'INFO', message: 'User 0x1234...5678 connected' },
                  { time: '14:32:25', level: 'ERROR', message: 'Failed transaction: insufficient balance' },
                  { time: '14:32:18', level: 'INFO', message: 'Protocol fee collected: $245.50' },
                  { time: '14:32:12', level: 'INFO', message: 'Smart Brain analysis completed' },
                  { time: '14:32:05', level: 'WARN', message: 'Suspicious activity flagged' },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2 bg-slate-800/30 rounded text-xs font-mono">
                    <span className="text-slate-500">{log.time}</span>
                    <span className={`px-2 py-0.5 rounded font-semibold ${
                      log.level === 'INFO' ? 'bg-blue-500/20 text-blue-400' :
                      log.level === 'WARN' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-slate-300 flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}