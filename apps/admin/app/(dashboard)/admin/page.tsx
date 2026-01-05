"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Target,
  Wallet,
  Activity,
  CheckCircle,
  AlertCircle,
  Ban,
  Edit,
  UserPlus,
  Play,
  Pause,
  Eye,
  TrendingUp,
  Server,
  Database,
  Zap,
  Shield,
  ChevronUp,
  ChevronDown,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { neo } from "@castquest/neo-ux-core";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Mock Data Types
interface User {
  id: string;
  wallet: string;
  role: string;
  kycStatus: string;
  joinDate: string;
}

interface Quest {
  id: string;
  name: string;
  ticker: string;
  status: "Live" | "Pending";
  states: number;
  rewardsPaid: string;
  aiEngine: string;
}

interface Permission {
  feature: string;
  admin: boolean;
  user: boolean;
  developer: boolean;
}

interface SystemLog {
  id: string;
  service: string;
  status: "online" | "offline" | "warning";
  message: string;
  timestamp: string;
  details?: string;
}

// Mock Data
const mockUsers: User[] = [
  { id: "1", wallet: "0x1234...5678", role: "Admin", kycStatus: "Verified", joinDate: "2024-01-15" },
  { id: "2", wallet: "0xabcd...efgh", role: "User", kycStatus: "Pending", joinDate: "2024-02-20" },
  { id: "3", wallet: "0x9876...5432", role: "Developer", kycStatus: "Verified", joinDate: "2024-03-10" },
  { id: "4", wallet: "0xfedc...ba98", role: "User", kycStatus: "Verified", joinDate: "2024-04-05" },
  { id: "5", wallet: "0x1111...2222", role: "User", kycStatus: "Rejected", joinDate: "2024-05-12" },
];

const mockQuests: Quest[] = [
  { id: "1", name: "Quest Alpha", ticker: "$ALPHA", status: "Live", states: 5, rewardsPaid: "1,250", aiEngine: "GPT-4" },
  { id: "2", name: "Quest Beta", ticker: "$BETA", status: "Pending", states: 3, rewardsPaid: "0", aiEngine: "Claude" },
  { id: "3", name: "Quest Gamma", ticker: "$GAMMA", status: "Live", states: 7, rewardsPaid: "3,400", aiEngine: "GPT-4" },
  { id: "4", name: "Quest Delta", ticker: "$DELTA", status: "Pending", states: 4, rewardsPaid: "0", aiEngine: "Gemini" },
];

const mockPermissions: Permission[] = [
  { feature: "Mint", admin: true, user: false, developer: true },
  { feature: "Withdraw Treasury", admin: true, user: false, developer: false },
  { feature: "Edit Frames", admin: true, user: false, developer: true },
  { feature: "View Analytics", admin: true, user: true, developer: true },
  { feature: "Create Quests", admin: true, user: false, developer: true },
  { feature: "Ban Users", admin: true, user: false, developer: false },
];

const mockSystemLogs: SystemLog[] = [
  { id: "1", service: "API Gateway", status: "online", message: "All systems operational", timestamp: "2024-12-30 17:15:00", details: "Response time: 45ms, Uptime: 99.9%" },
  { id: "2", service: "Database", status: "online", message: "Connected", timestamp: "2024-12-30 17:14:30", details: "Queries: 1.2M/day, Latency: 12ms" },
  { id: "3", service: "AI Engine", status: "online", message: "Processing requests", timestamp: "2024-12-30 17:14:15", details: "Model: GPT-4, Queue: 3 pending" },
  { id: "4", service: "Smart Contracts", status: "online", message: "Deployed and verified", timestamp: "2024-12-30 17:13:45", details: "Network: Base, Gas: 21 gwei" },
  { id: "5", service: "Worker Queue", status: "warning", message: "High load detected", timestamp: "2024-12-30 17:13:20", details: "Queue size: 127, Workers: 5/10 active" },
];

const activityData = [
  { date: "Dec 24", users: 120, quests: 45, transactions: 230 },
  { date: "Dec 25", users: 150, quests: 52, transactions: 280 },
  { date: "Dec 26", users: 180, quests: 60, transactions: 320 },
  { date: "Dec 27", users: 220, quests: 75, transactions: 390 },
  { date: "Dec 28", users: 280, quests: 88, transactions: 450 },
  { date: "Dec 29", users: 310, quests: 95, transactions: 510 },
  { date: "Dec 30", users: 350, quests: 102, transactions: 580 },
];

const distributionData = [
  { name: "Active Quests", value: 35 },
  { name: "Completed", value: 45 },
  { name: "Pending", value: 15 },
  { name: "Failed", value: 5 },
];

const COLORS = ["#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

// Stats Card Component
function StatCard({ icon: Icon, label, value, subtitle, trend }: any) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg border transition-all duration-300 hover:scale-105",
        neo.colors.bg.secondary,
        neo.colors.border.active,
        neo.glow.idle,
        "hover:" + neo.glow.active
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-8 h-8 text-cyan-400" />
        {trend && (
          <div className="flex items-center text-emerald-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-neutral-100 mb-1">{value}</div>
      <div className="text-sm text-neutral-400">{label}</div>
      {subtitle && <div className="text-xs text-neutral-500 mt-1">{subtitle}</div>}
    </div>
  );
}

// Table Component with Search and Pagination
function DataTable({ columns, data, globalFilter, setGlobalFilter }: any) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="w-full">
          <thead className={cn(neo.colors.bg.tertiary)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase tracking-wider cursor-pointer hover:text-cyan-400"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-2">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc" && <ChevronUp className="w-4 h-4" />}
                      {header.column.getIsSorted() === "desc" && <ChevronDown className="w-4 h-4" />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={cn(neo.colors.bg.secondary)}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-neutral-300">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, data.length)} of{" "}
          {data.length} results
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              "p-2 rounded border transition-colors",
              neo.colors.border.default,
              "hover:border-cyan-500/50 hover:bg-neutral-800",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-neutral-400">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              "p-2 rounded border transition-colors",
              neo.colors.border.default,
              "hover:border-cyan-500/50 hover:bg-neutral-800",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [userFilter, setUserFilter] = useState("");
  const [questFilter, setQuestFilter] = useState("");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // User Management Columns
  const userColumns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "wallet",
        header: "Wallet",
        cell: ({ row }) => (
          <span className="font-mono text-cyan-400">{row.original.wallet}</span>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <span className={cn(
            "px-2 py-1 rounded text-xs font-semibold",
            row.original.role === "Admin" ? "bg-purple-500/20 text-purple-400" :
            row.original.role === "Developer" ? "bg-cyan-500/20 text-cyan-400" :
            "bg-neutral-700 text-neutral-300"
          )}>
            {row.original.role}
          </span>
        ),
      },
      {
        accessorKey: "kycStatus",
        header: "KYC Status",
        cell: ({ row }) => (
          <span className={cn(
            "px-2 py-1 rounded text-xs font-semibold",
            row.original.kycStatus === "Verified" ? "bg-emerald-500/20 text-emerald-400" :
            row.original.kycStatus === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
            "bg-red-500/20 text-red-400"
          )}>
            {row.original.kycStatus}
          </span>
        ),
      },
      {
        accessorKey: "joinDate",
        header: "Join Date",
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex gap-2">
            <button className={cn("p-1 rounded hover:bg-neutral-700", neo.glow.idle)} title="Ban">
              <Ban className="w-4 h-4 text-red-400" />
            </button>
            <button className={cn("p-1 rounded hover:bg-neutral-700", neo.glow.idle)} title="Edit">
              <Edit className="w-4 h-4 text-cyan-400" />
            </button>
            <button className={cn("p-1 rounded hover:bg-neutral-700", neo.glow.idle)} title="Assign Role">
              <UserPlus className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Quest Management Columns
  const questColumns: ColumnDef<Quest>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name / Ticker",
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-neutral-100">{row.original.name}</div>
            <div className="text-xs text-cyan-400">{row.original.ticker}</div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className={cn(
            "px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 w-fit",
            row.original.status === "Live" ? "bg-emerald-500/20 text-emerald-400" : "bg-yellow-500/20 text-yellow-400"
          )}>
            {row.original.status === "Live" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {row.original.status}
          </span>
        ),
      },
      {
        accessorKey: "states",
        header: "States",
      },
      {
        accessorKey: "rewardsPaid",
        header: "Rewards Paid",
        cell: ({ row }) => (
          <span className="text-emerald-400 font-semibold">{row.original.rewardsPaid} $CAST</span>
        ),
      },
      {
        accessorKey: "aiEngine",
        header: "AI Engine",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.status === "Pending" && (
              <button className={cn("p-1 rounded hover:bg-neutral-700", neo.glow.idle)} title="Approve">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </button>
            )}
            <button className={cn("p-1 rounded hover:bg-neutral-700", neo.glow.idle)} title="Edit">
              <Edit className="w-4 h-4 text-cyan-400" />
            </button>
            <button className={cn("p-1 rounded hover:bg-neutral-700", neo.glow.idle)} title="Deploy">
              <Play className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className={cn("min-h-screen p-6 space-y-8", neo.colors.bg.primary)}>
      {/* Header */}
      <header className="space-y-2">
        <h1 className={cn("text-4xl font-bold", neo.colors.text.primary, neo.glow.active)}>
          Admin Dashboard
        </h1>
        <p className={cn("text-sm", neo.colors.text.secondary)}>
          Comprehensive system overview with user management, quest monitoring, and real-time analytics
        </p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={Users} label="Total Users" value="2,847" subtitle="Active this month" trend="+12.5%" />
        <StatCard icon={Target} label="Active Quests" value="102" subtitle="19 pending approval" trend="+8.3%" />
        <StatCard icon={Wallet} label="Treasury Balance" value="1.2M" subtitle="$CAST tokens" trend="+15.7%" />
        <StatCard icon={Activity} label="AI Uptime" value="99.9%" subtitle="Last 30 days" />
        <StatCard icon={CheckCircle} label="Pending Approvals" value="23" subtitle="Requires action" />
      </section>

      {/* User Management Table */}
      <section className={cn("p-6 rounded-lg border", neo.colors.bg.secondary, neo.colors.border.active, neo.glow.idle)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              User Management
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Manage user roles, KYC status, and permissions</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2 rounded border bg-neutral-900 text-neutral-200 text-sm",
                  neo.colors.border.default,
                  "focus:border-cyan-500/50 focus:outline-none"
                )}
              />
            </div>
          </div>
        </div>
        <DataTable columns={userColumns} data={mockUsers} globalFilter={userFilter} setGlobalFilter={setUserFilter} />
      </section>

      {/* Quest/Frames Management Table */}
      <section className={cn("p-6 rounded-lg border", neo.colors.bg.secondary, neo.colors.border.active, neo.glow.idle)}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              Quest & Frames Management
            </h2>
            <p className="text-xs text-neutral-500 mt-1">Monitor quest status, rewards, and AI engine performance</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search quests..."
                value={questFilter}
                onChange={(e) => setQuestFilter(e.target.value)}
                className={cn(
                  "pl-10 pr-4 py-2 rounded border bg-neutral-900 text-neutral-200 text-sm",
                  neo.colors.border.default,
                  "focus:border-cyan-500/50 focus:outline-none"
                )}
              />
            </div>
          </div>
        </div>
        <DataTable columns={questColumns} data={mockQuests} globalFilter={questFilter} setGlobalFilter={setQuestFilter} />
      </section>

      {/* Permissions/RBAC Matrix */}
      <section className={cn("p-6 rounded-lg border", neo.colors.bg.secondary, neo.colors.border.active, neo.glow.idle)}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Permissions & RBAC Matrix
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Role-based access control for system features</p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-neutral-800">
          <table className="w-full">
            <thead className={cn(neo.colors.bg.tertiary)}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-300 uppercase">Feature</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-purple-400 uppercase">Admin</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-400 uppercase">User</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-cyan-400 uppercase">Developer</th>
              </tr>
            </thead>
            <tbody className={cn(neo.colors.bg.secondary)}>
              {mockPermissions.map((perm) => (
                <tr key={perm.feature} className="border-t border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-neutral-300 font-medium">{perm.feature}</td>
                  <td className="px-4 py-3 text-center">
                    {perm.admin ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-neutral-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.user ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-neutral-700">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {perm.developer ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <span className="text-neutral-700">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <section className={cn("p-6 rounded-lg border", neo.colors.bg.secondary, neo.colors.border.active, neo.glow.idle)}>
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Platform Activity
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="date" stroke="#a3a3a3" />
              <YAxis stroke="#a3a3a3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #404040",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
              <Line type="monotone" dataKey="quests" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
              <Line type="monotone" dataKey="transactions" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7" }} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Pie Chart */}
        <section className={cn("p-6 rounded-lg border", neo.colors.bg.secondary, neo.colors.border.active, neo.glow.idle)}>
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-cyan-400" />
            Quest Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#171717",
                  border: "1px solid #404040",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>

      {/* System Status & Logs */}
      <section className={cn("p-6 rounded-lg border", neo.colors.bg.secondary, neo.colors.border.active, neo.glow.idle)}>
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-neutral-100 flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            System Status & Logs
          </h2>
          <p className="text-xs text-neutral-500 mt-1">Real-time system health monitoring with detailed logs</p>
        </div>
        <div className="space-y-2">
          {mockSystemLogs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all",
                neo.colors.bg.tertiary,
                neo.colors.border.default,
                "hover:border-cyan-500/50"
              )}
              onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    log.status === "online" ? "bg-emerald-400 animate-pulse" :
                    log.status === "warning" ? "bg-yellow-400 animate-pulse" :
                    "bg-red-400"
                  )} />
                  <div>
                    <div className="font-semibold text-neutral-100">{log.service}</div>
                    <div className="text-xs text-neutral-500">{log.message}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-neutral-500">{log.timestamp}</div>
                  <Eye className="w-4 h-4 text-neutral-500" />
                </div>
              </div>
              {expandedLog === log.id && log.details && (
                <div className={cn("mt-3 pt-3 border-t", neo.colors.border.default)}>
                  <div className="text-xs text-neutral-400 font-mono">{log.details}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
