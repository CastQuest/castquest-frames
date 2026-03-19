"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Shield,
  Mail,
  Calendar,
  MoreVertical,
  AlertCircle,
  Check,
  X
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: { id: string; name: string } | null
  createdAt: string
}

interface Role {
  id: string
  name: string
  description: string | null
}

// Demo data
const demoUsers: User[] = [
  { id: "1", email: "admin@castquest.xyz", name: "Admin User", image: null, role: { id: "r1", name: "ADMIN" }, createdAt: "2024-01-15" },
  { id: "2", email: "operator@castquest.xyz", name: "Quest Operator", image: null, role: { id: "r2", name: "OPERATOR" }, createdAt: "2024-02-20" },
  { id: "3", email: "creator@castquest.xyz", name: "Frame Creator", image: null, role: { id: "r3", name: "CREATOR" }, createdAt: "2024-03-10" },
  { id: "4", email: "viewer@castquest.xyz", name: "Platform Viewer", image: null, role: { id: "r4", name: "VIEWER" }, createdAt: "2024-04-05" },
]

const demoRoles: Role[] = [
  { id: "r1", name: "ADMIN", description: "Full system access" },
  { id: "r2", name: "OPERATOR", description: "Manage quests and frames" },
  { id: "r3", name: "CREATOR", description: "Create and publish content" },
  { id: "r4", name: "VIEWER", description: "Read-only access" },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUsers(demoUsers)
      setRoles(demoRoles)
      setLoading(false)
    }, 500)
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const updateUserRole = async (userId: string, roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u))
    setEditingUser(null)
    showNotification("success", "User role updated")
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Delete this user? This action cannot be undone.")) return
    setUsers(prev => prev.filter(u => u.id !== userId))
    showNotification("success", "User deleted")
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !filterRole || u.role?.name === filterRole
    return matchesSearch && matchesRole
  })

  const getRoleColor = (roleName: string | undefined) => {
    switch (roleName) {
      case "ADMIN": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "OPERATOR": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "CREATOR": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      default: return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-slate-400 mt-1">Manage platform users and their roles</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Plus className="w-4 h-4" />
            Invite User
          </button>
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

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: users.length, icon: Users, color: "emerald" },
            { label: "Admins", value: users.filter(u => u.role?.name === "ADMIN").length, icon: Shield, color: "red" },
            { label: "Operators", value: users.filter(u => u.role?.name === "OPERATOR").length, icon: Users, color: "purple" },
            { label: "Creators", value: users.filter(u => u.role?.name === "CREATOR").length, icon: Users, color: "cyan" },
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

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <select
            value={filterRole || ""}
            onChange={(e) => setFilterRole(e.target.value || null)}
            className="px-4 py-3 bg-slate-900/80 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              No users found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          role="img" 
                          aria-label={`Avatar for ${user.name || user.email}`}
                          className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-semibold"
                        >
                          {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name || "Unnamed User"}</div>
                          <div className="text-sm text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {editingUser?.id === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={user.role?.id}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="px-3 py-1 bg-slate-800 border border-slate-600 rounded text-sm text-white"
                          >
                            {roles.map(role => (
                              <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                          </select>
                          <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role?.name)}`}>
                          <Shield className="w-3 h-3" />
                          {user.role?.name || "NO ROLE"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="Edit role"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
