import { NextResponse } from "next/server";
import {
  permissionsService,
  ROLES,
} from "@castquest/sdk/permissions/PermissionsService";

// GET /api/permissions - Get all roles and permissions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId) {
    // Get user-specific permissions
    const permissions = permissionsService.getUserPermissions(userId);
    const user = permissionsService.getUser(userId);

    return NextResponse.json({
      userId,
      permissions,
      user,
    });
  }

  // Get all roles
  const roles = permissionsService.getRoles();
  const users = permissionsService.getUsers();

  return NextResponse.json({
    roles,
    users,
    predefinedRoles: Object.values(ROLES),
  });
}

// POST /api/permissions - Create new role or user
export async function POST(request: Request) {
  const body = await request.json();
  const { type, data } = body;

  if (type === "role") {
    const role = permissionsService.createRole(data);
    return NextResponse.json({ role });
  }

  if (type === "user") {
    const user = permissionsService.createUser(data);
    return NextResponse.json({ user });
  }

  return NextResponse.json(
    { error: "Invalid type" },
    { status: 400 }
  );
}

// PUT /api/permissions - Update role or user permissions
export async function PUT(request: Request) {
  const body = await request.json();
  const { type, id, action, value } = body;

  if (type === "user") {
    if (action === "addRole") {
      permissionsService.addRoleToUser(id, value);
    } else if (action === "removeRole") {
      permissionsService.removeRoleFromUser(id, value);
    } else if (action === "addPermission") {
      permissionsService.addPermissionToUser(id, value);
    } else if (action === "removePermission") {
      permissionsService.removePermissionFromUser(id, value);
    }

    const user = permissionsService.getUser(id);
    return NextResponse.json({ user });
  }

  if (type === "role") {
    const role = permissionsService.updateRole(id, value);
    return NextResponse.json({ role });
  }

  return NextResponse.json(
    { error: "Invalid type" },
    { status: 400 }
  );
}

// DELETE /api/permissions - Delete role
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleId = searchParams.get("roleId");

  if (!roleId) {
    return NextResponse.json(
      { error: "roleId required" },
      { status: 400 }
    );
  }

  const success = permissionsService.deleteRole(roleId);

  return NextResponse.json({ success });
}
