/**
 * Permissions Management System
 * Admin panel for managing user roles, access control, and permissions
 * Integrated with Oracle DB and Smart Brain
 */

// Permission definitions
export type Permission =
  | "frames.read"
  | "frames.write"
  | "frames.delete"
  | "quests.read"
  | "quests.write"
  | "quests.delete"
  | "mints.read"
  | "mints.write"
  | "mints.delete"
  | "workers.read"
  | "workers.control"
  | "brain.read"
  | "brain.control"
  | "dashboard.read"
  | "dashboard.admin"
  | "users.read"
  | "users.write"
  | "permissions.manage"
  | "system.admin";

// User role
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

// User with permissions
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  customPermissions: Permission[];
  active: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

// Predefined roles
export const ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    id: "super_admin",
    name: "Super Administrator",
    description: "Full system access",
    permissions: [
      "frames.read", "frames.write", "frames.delete",
      "quests.read", "quests.write", "quests.delete",
      "mints.read", "mints.write", "mints.delete",
      "workers.read", "workers.control",
      "brain.read", "brain.control",
      "dashboard.read", "dashboard.admin",
      "users.read", "users.write",
      "permissions.manage",
      "system.admin",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  OPERATOR: {
    id: "operator",
    name: "Operator",
    description: "Operational access to dashboard and workers",
    permissions: [
      "frames.read", "frames.write",
      "quests.read", "quests.write",
      "mints.read", "mints.write",
      "workers.read", "workers.control",
      "brain.read",
      "dashboard.read",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  DEVELOPER: {
    id: "developer",
    name: "Developer",
    description: "Development and testing access",
    permissions: [
      "frames.read", "frames.write",
      "quests.read", "quests.write",
      "mints.read",
      "workers.read",
      "brain.read",
      "dashboard.read",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  VIEWER: {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access",
    permissions: [
      "frames.read",
      "quests.read",
      "mints.read",
      "workers.read",
      "brain.read",
      "dashboard.read",
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

// Permissions service
export class PermissionsService {
  private users: Map<string, User>;
  private roles: Map<string, Role>;

  constructor() {
    this.users = new Map();
    this.roles = new Map();
    
    // Initialize predefined roles
    Object.values(ROLES).forEach((role) => {
      this.roles.set(role.id, role);
    });
  }

  /**
   * Check if user has permission
   */
  hasPermission(userId: string, permission: Permission): boolean {
    const user = this.users.get(userId);
    if (!user || !user.active) return false;

    // Check custom permissions
    if (user.customPermissions.includes(permission)) return true;

    // Check role-based permissions
    for (const roleId of user.roles) {
      const role = this.roles.get(roleId);
      if (role && role.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if user has any of the permissions
   */
  hasAnyPermission(userId: string, permissions: Permission[]): boolean {
    return permissions.some((p) => this.hasPermission(userId, p));
  }

  /**
   * Check if user has all permissions
   */
  hasAllPermissions(userId: string, permissions: Permission[]): boolean {
    return permissions.every((p) => this.hasPermission(userId, p));
  }

  /**
   * Get user permissions
   */
  getUserPermissions(userId: string): Permission[] {
    const user = this.users.get(userId);
    if (!user) return [];

    const permissions = new Set<Permission>(user.customPermissions);

    user.roles.forEach((roleId) => {
      const role = this.roles.get(roleId);
      if (role) {
        role.permissions.forEach((p) => permissions.add(p));
      }
    });

    return Array.from(permissions);
  }

  /**
   * Add role to user
   */
  addRoleToUser(userId: string, roleId: string): void {
    const user = this.users.get(userId);
    if (user && !user.roles.includes(roleId)) {
      user.roles.push(roleId);
    }
  }

  /**
   * Remove role from user
   */
  removeRoleFromUser(userId: string, roleId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.roles = user.roles.filter((r) => r !== roleId);
    }
  }

  /**
   * Add custom permission to user
   */
  addPermissionToUser(userId: string, permission: Permission): void {
    const user = this.users.get(userId);
    if (user && !user.customPermissions.includes(permission)) {
      user.customPermissions.push(permission);
    }
  }

  /**
   * Remove custom permission from user
   */
  removePermissionFromUser(userId: string, permission: Permission): void {
    const user = this.users.get(userId);
    if (user) {
      user.customPermissions = user.customPermissions.filter(
        (p) => p !== permission
      );
    }
  }

  /**
   * Create new user
   */
  createUser(userData: Omit<User, "id" | "createdAt">): User {
    const user: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Get all users
   */
  getUsers(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Get user by ID
   */
  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  /**
   * Create custom role
   */
  createRole(roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Role {
    const role: Role = {
      ...roleData,
      id: `role_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.roles.set(role.id, role);
    return role;
  }

  /**
   * Get all roles
   */
  getRoles(): Role[] {
    return Array.from(this.roles.values());
  }

  /**
   * Get role by ID
   */
  getRole(roleId: string): Role | undefined {
    return this.roles.get(roleId);
  }

  /**
   * Update role
   */
  updateRole(
    roleId: string,
    updates: Partial<Omit<Role, "id" | "createdAt">>
  ): Role | undefined {
    const role = this.roles.get(roleId);
    if (role) {
      Object.assign(role, { ...updates, updatedAt: new Date() });
      return role;
    }
    return undefined;
  }

  /**
   * Delete role
   */
  deleteRole(roleId: string): boolean {
    // Don't allow deleting predefined roles
    if (Object.values(ROLES).some((r) => r.id === roleId)) {
      return false;
    }

    return this.roles.delete(roleId);
  }
}

// Export singleton instance
export const permissionsService = new PermissionsService();
