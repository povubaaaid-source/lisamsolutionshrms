export type UserRole = "super_admin" | "admin" | "employee" | "client";

export type PermissionAction = "view" | "create" | "edit" | "delete" | "approve" | "export" | "manage";

export type PermissionKey =
  | "*"
  | `${"company" | "settings" | "roles" | "employees" | "clients" | "hr" | "attendance" | "leaves" | "projects" | "tasks" | "finance" | "payroll" | "tickets" | "recruitment" | "reports" | "messages" | "events" | "notices" | "profile"}.${PermissionAction | "*"}`;

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: number | string | null;
  permissions?: string[];
  modules?: string[];
  impersonator_role?: UserRole | null;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RoleDefinition = {
  label: string;
  panel: "platform" | "company" | "member" | "client";
  defaultRoute: string;
  description: string;
  scope: string;
};

export const roleDefinitions: Record<UserRole, RoleDefinition> = {
  super_admin: {
    label: "Super Admin",
    panel: "platform",
    defaultRoute: "/super-admin/dashboard",
    description: "Platform owner who manages companies, packages, invoices, global settings, and platform admins.",
    scope: "No company scope. Can administer the SaaS/platform layer only.",
  },
  admin: {
    label: "Admin",
    panel: "company",
    defaultRoute: "/dashboard",
    description: "Company administrator who manages HR, clients, work, finance, payroll, recruitment, settings, and reports.",
    scope: "Company scoped. Can manage records inside their company.",
  },
  employee: {
    label: "Employee",
    panel: "member",
    defaultRoute: "/member/dashboard",
    description: "Internal staff/member portal for attendance, leaves, assigned projects, tasks, tickets, notices, and profile.",
    scope: "Company scoped and generally self/team scoped depending on assigned permissions.",
  },
  client: {
    label: "Client",
    panel: "client",
    defaultRoute: "/dashboard/client",
    description: "Customer portal for assigned projects, invoices, estimates, payments, tickets, events, notices, and communication.",
    scope: "Company scoped and limited to client-owned or shared records.",
  },
};

export const roleDefaultRoutes: Record<UserRole, string> = {
  super_admin: roleDefinitions.super_admin.defaultRoute,
  admin: roleDefinitions.admin.defaultRoute,
  employee: roleDefinitions.employee.defaultRoute,
  client: roleDefinitions.client.defaultRoute,
};

export const rolePermissions: Record<UserRole, PermissionKey[]> = {
  super_admin: ["*"],
  admin: [
    "company.*",
    "settings.*",
    "roles.*",
    "employees.*",
    "clients.*",
    "hr.*",
    "attendance.*",
    "leaves.*",
    "projects.*",
    "tasks.*",
    "finance.*",
    "payroll.*",
    "tickets.*",
    "recruitment.*",
    "reports.*",
    "messages.*",
    "events.*",
    "notices.*",
    "profile.*",
  ],
  employee: [
    "profile.*",
    "attendance.view",
    "attendance.create",
    "leaves.*",
    "projects.view",
    "tasks.*",
    "tickets.*",
    "messages.*",
    "events.view",
    "notices.view",
  ],
  client: [
    "profile.*",
    "projects.view",
    "tasks.view",
    "tasks.create",
    "finance.view",
    "tickets.*",
    "messages.*",
    "events.view",
    "notices.view",
  ],
};

const publicPathPrefixes = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email", "/unauthorized"];

type RoleRouteRule = {
  prefixes: string[];
  roles: UserRole[];
};

export const roleRouteRules: RoleRouteRule[] = [
  {
    prefixes: ["/super-admin"],
    roles: ["super_admin"],
  },
  {
    prefixes: ["/member"],
    roles: ["admin", "employee"],
  },
  {
    prefixes: ["/settings", "/account-setup", "/module-settings", "/role-permission", "/custom-fields"],
    roles: ["admin"],
  },
  {
    prefixes: ["/billing", "/payroll", "/payment-gateway-credentials", "/email-settings", "/invoice-settings"],
    roles: ["admin"],
  },
  {
    prefixes: ["/employees", "/teams", "/designation", "/shift-types", "/attendance-settings", "/leaves-settings"],
    roles: ["admin"],
  },
  {
    prefixes: ["/attendance", "/leaves", "/holidays", "/leave-type"],
    roles: ["admin", "employee"],
  },
  {
    prefixes: ["/clients", "/client-contacts", "/client-settings"],
    roles: ["admin"],
  },
  {
    prefixes: ["/dashboard/client"],
    roles: ["admin", "client"],
  },
  {
    prefixes: ["/dashboard/hr", "/dashboard/finance", "/dashboard/project", "/dashboard/ticket"],
    roles: ["admin", "employee", "client"],
  },
  {
    prefixes: ["/invoices", "/estimates", "/proposals", "/credit-notes", "/payments", "/expenses", "/invoice-recurring", "/expenses-recurring"],
    roles: ["admin", "client"],
  },
  {
    prefixes: ["/leads", "/lead-form", "/lead-settings"],
    roles: ["admin"],
  },
  {
    prefixes: ["/recruitment"],
    roles: ["admin"],
  },
  {
    prefixes: ["/reports"],
    roles: ["admin"],
  },
  {
    prefixes: ["/projects", "/tasks", "/taskboard", "/task-calendar", "/time-logs", "/discussion", "/tickets", "/support-tickets", "/user-chat", "/events", "/event-calendar", "/notices", "/faqs", "/search", "/profile"],
    roles: ["admin", "employee", "client"],
  },
  {
    prefixes: ["/products", "/contracts", "/notes"],
    roles: ["admin", "client"],
  },
];

export const normalizeRole = (role?: string | null): UserRole => {
  if (role === "super-admin") return "super_admin";
  if (role === "super_admin" || role === "admin" || role === "employee" || role === "client") {
    return role;
  }

  return "admin";
};

export const isPublicPath = (pathname: string) =>
  publicPathPrefixes.some((prefix) => pathname === prefix || (prefix !== "/" && pathname.startsWith(`${prefix}/`)));

export const getDefaultRouteForRole = (role?: string | null) => roleDefaultRoutes[normalizeRole(role)];

export const canRoleAccessPath = (role: UserRole, pathname: string) => {
  if (isPublicPath(pathname)) return true;

  const matchedRule = roleRouteRules.find((rule) =>
    rule.prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );

  if (!matchedRule) {
    return role === "admin";
  }

  return matchedRule.roles.includes(role);
};

export const canUserAccessPath = (user: AuthUser | null, pathname: string) =>
  Boolean(user && canRoleAccessPath(normalizeRole(user.role), pathname));

export const userHasPermission = (user: AuthUser | null, permission: PermissionKey) => {
  if (!user) return false;
  const permissions = user.permissions?.length ? user.permissions : rolePermissions[normalizeRole(user.role)];
  if (permissions.includes("*")) return true;

  const [moduleName] = permission.split(".");
  return permissions.some((item) => item === permission || item === `${moduleName}.*` || item === `${user.role}.*`);
};

export const makeDevUserFromEmail = (email: string): AuthUser => {
  const normalizedEmail = email.toLowerCase();
  const role: UserRole = normalizedEmail.includes("super")
    ? "super_admin"
    : normalizedEmail.includes("employee")
      ? "employee"
      : normalizedEmail.includes("client")
        ? "client"
        : "admin";

  return {
    id: role === "super_admin" ? "platform-1" : `${role}-1`,
    name: roleDefinitions[role].label,
    email,
    role,
    company_id: role === "super_admin" ? null : 1,
    permissions: rolePermissions[role],
    modules: role === "super_admin" ? ["platform"] : ["hr", "work", "finance", "tickets", "messages"],
  };
};
