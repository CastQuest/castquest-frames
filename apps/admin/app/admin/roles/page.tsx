"use client"

import { useState, useEffect } from "react"
import { 
  Shield, 
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Lock,
  Users,
  Check,
  X,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from "lucide-react"

interface Permission {
  id: string
  name: string
  description: string | null
  action: string
  resource: string
}

interface Role {
  id: string
  name: string
  description: string | null
  permissions: Permission[]
}

// Demo data
const demoPermissions: Permission[] = [
  { id: "p1", name: "users:read", description: "View users", action: "read", resource: "users" },
  { id: "p2", name: "users:create", description: "Create users", action: "create", resource: "users" },
  { id: "p3", name: "users:update", description: "Update users", action: "update", resource: "users" },
  { id: "p4", name: "users:delete", description: "Delete users", action: "delete", resource: "users" },
  { id: "p5", name: "contracts:read", description: "View contracts", action: "read", resource: "contracts" },
  { id: "p6", name: "contracts:deploy", description: "Deploy contracts", action: "execute", resource: "contracts" },
  { id: "p7", name: "agents:read", description: "View agents", action: "read", resource: "agents" },
  { id: "p8", name: "agents:execute", description: "Run agents", action: "execute", resource: "agents" },
  { id: "p9", name: "agents:manage", description: "Configure agents", action: "manage", resource: "agents" },
  { id: "p10", name: "flags:read", description: "View feature flags", action: "read", resource: "feature_flags" },
  { id: "p11", name: "flags:manage", description: "Manage feature flags", action: "manage", resource: "feature_flags" },
  { id: "p12", name: "frames:read", description: "View frames", action: "read", resource: "frames" },
  { id: "p13", name: "frames:create", description: "Create frames", action: "create", resource: "frames" },
  { id: "p14", name: "quests:manage", description: "Manage quests", action: "manage", resource: "quests" },
]

const demoRoles: Role[] = [
  { 
    id: "r1", 
    name: "ADMIN", 
    description: "Full system administrator with all permissions",
    permissions: demoPermissions 
  },
  { 
    id: "r2", 
    name: "OPERATOR", 
    description: "Can manage quests, frames, and run agents",
    permissions: demoPermissions.filter(p => 
      ["read", "execute"].includes(p.action) || 
      ["quests", "frames"].includes(p.resource)
    )
  },
  { 
    id: "r3", 
    name: "CREATOR", 
    description: "Can create and manage own content",
    permissions: demoPermissions.filter(p => 
      p.action === "read" || 
      (["frames", "quests"].includes(p.resource) && ["create", "update"].includes(p.action))
    )
  },
  { 
    id: "r4", 
    name: "VIEWER", 
    description: "Read-only access to public resources",
    permissions: demoPermissions.filter(p => p.action === "read")
  },
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedRole, setExpandedRole] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(new Set())
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    setTimeout(() => {
      setRoles(demoRoles)
      setPermissions(demoPermissions)
      setLoading(false)
    }, 500)
  }, [])

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 3000)
  }

  const toggleRoleExpand = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId)
  }

  const startEditRole = (role: Role) => {
    setEditingRole(role)
    setSelectedPermissions(new Set(role.permissions.map(p => p.id)))
    setNewRoleName(role.name)
    setNewRoleDescription(role.description || "")
  }

  const saveRole = () => {
    if (!newRoleName.match(/^[A-Z][A-Z_]*$/)) {
      showNotification("error", "Role name must be UPPER_CASE")
      return
    }
    
    const rolePermissions = permissions.filter(p => selectedPermissions.has(p.id))
    
    if (editingRole) {
      setRoles(prev => prev.map(r => 
        r.id === editingRole.id 
          ? { ...r, name: newRoleName, description: newRoleDescription, permissions: rolePermissions }
          : r
      ))
      showNotification("success", `Role ${newRoleName} updated`)
    } else {
      const newRole: Role = {
        id: `r${Date.now()}`,
        name: newRoleName,
        description: newRoleDescription,
        permissions: rolePermissions,
      }
      setRoles(prev => [...prev, newRole])
      showNotification("success", `Role ${newRoleName} created`)
    }
    
    resetForm()
  }

  const deleteRole = (roleId: string, roleName: string) => {
    if (!confirm(`Delete role "${roleName}"? Users with this role will lose their permissions.`)) return
    setRoles(prev => prev.filter(r => r.id !== roleId))
    showNotification("success", `Role ${roleName} deleted`)
  }

  const resetForm = () => {
    setShowCreateForm(false)
    setEditingRole(null)
    setNewRoleName("")
    setNewRoleDescription("")
    setSelectedPermissions(new Set())
  }

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => {
      const next = new Set(prev)
      if (next.has(permId)) {
        next.delete(permId)
      } else {
        next.add(permId)
      }
      return next
    })
  }

  // Group permissions by resource
  const permissionsByResource = permissions.reduce((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = []
    acc[perm.resource].push(perm)
    return acc
  }, {} as Record<string, Permission[]>)

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "ADMIN": return "from-red-500 to-orange-500"
      case "OPERATOR": return "from-purple-500 to-pink-500"
      case "CREATOR": return "from-emerald-500 to-cyan-500"
      default: return "from-slate-500 to-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Roles & Permissions
            </h1>
            <p className="text-slate-400 mt-1">Configure access control for the platform</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold hover:from-emerald-400 hover:to-cyan-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Create Role
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

        {/* Create/Edit Form */}
        {(showCreateForm || editingRole) && (
          <div className="mb-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingRole ? `Edit Role: ${editingRole.name}` : "Create New Role"}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Role Name (UPPER_CASE)</label>
                <input
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value.toUpperCase())}
                  placeholder="MY_ROLE"
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Description</label>
                <input
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Role description..."
                  className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm text-slate-400 mb-3">Permissions</label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(permissionsByResource).map(([resource, perms]) => (
                  <div key={resource} className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-slate-300 mb-3 capitalize">{resource.replace("_", " ")}</h4>
                    <div className="space-y-2">
                      {perms.map(perm => (
                        <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.has(perm.id)}
                            onChange={() => togglePermission(perm.id)}
                            className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-emerald-500 focus:ring-emerald-500"
                          />
                          <span className="text-sm text-slate-300">{perm.action}</span>
                          <span className="text-xs text-slate-500">- {perm.description}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={saveRole}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
              >
                {editingRole ? "Save Changes" : "Create Role"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-300 font-semibold hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Roles List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-12 text-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              Loading roles...
            </div>
          ) : (
            roles.map((role) => (
              <div
                key={role.id}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden"
              >
                <div
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => toggleRoleExpand(role.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRoleColor(role.name)} flex items-center justify-center`}>
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-white">{role.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-slate-700 rounded-full text-slate-400">
                          {role.permissions.length} permissions
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEditRole(role) }}
                      className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteRole(role.id, role.name) }}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedRole === role.id ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
                
                {expandedRole === role.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800">
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map(perm => (
                        <span
                          key={perm.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300"
                        >
                          <Lock className="w-3 h-3 text-emerald-400" />
                          {perm.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Permissions Summary */}
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Available Permissions</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(permissionsByResource).map(([resource, perms]) => (
              <div key={resource}>
                <h4 className="text-sm font-semibold text-emerald-400 mb-2 capitalize">{resource.replace("_", " ")}</h4>
                <ul className="space-y-1">
                  {perms.map(perm => (
                    <li key={perm.id} className="text-xs text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {perm.action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
