export type UserRole = "super_admin" | "admin" | "employee" | "client";

export type AuthUser = {
  id: number | string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: number | string | null;
  permissions?: string[];
  modules?: string[];
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export const roleDefaultRoutes: Record<UserRole, string> = {
  super_admin: "/super-admin/dashboard",
  admin: "/dashboard",
  employee: "/dashboard/hr",
  client: "/dashboard/client",
};

const publicPaths = ["/login", "/signup", "/forgot-password"];

const roleRouteRules: Array<{
  prefixes: string[];
  roles: UserRole[];
}> = [
  {
    prefixes: ["/super-admin"],
    roles: ["super_admin"],
  },
  {
    prefixes: [
      "/settings",
      "/account-setup",
      "/module-settings",
      "/role-permission",
      "/custom-fields",
      "/billing",
      "/payroll",
    ],
    roles: ["admin"],
  },
  {
    prefixes: ["/employees", "/teams", "/designation", "/attendance", "/leaves", "/holidays"],
    roles: ["admin", "employee"],
  },
  {
    prefixes: ["/clients", "/client-contacts"],
    roles: ["admin"],
  },
  {
    prefixes: ["/dashboard/client"],
    roles: ["admin", "client"],
  },
  {
    prefixes: ["/dashboard/hr"],
    roles: ["admin", "employee"],
  },
  {
    prefixes: ["/dashboard/finance", "/invoices", "/estimates", "/proposals", "/credit-notes", "/payments", "/expenses"],
    roles: ["admin", "client"],
  },
  {
    prefixes: ["/leads", "/lead-form", "/lead-settings"],
    roles: ["admin"],
  },
];

export const normalizeRole = (role?: string | null): UserRole => {
  if (role === "super_admin" || role === "admin" || role === "employee" || role === "client") {
    return role;
  }

  return "admin";
};

export const isPublicPath = (pathname: string) => publicPaths.includes(pathname);

export const getDefaultRouteForRole = (role?: string | null) => roleDefaultRoutes[normalizeRole(role)];

export const canRoleAccessPath = (role: UserRole, pathname: string) => {
  if (isPublicPath(pathname)) return true;

  const matchedRule = roleRouteRules.find((rule) =>
    rule.prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );

  if (!matchedRule) {
    return role !== "super_admin";
  }

  return matchedRule.roles.includes(role);
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
    id: role === "super_admin" ? "platform-1" : "company-1",
    name: role
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    email,
    role,
    company_id: role === "super_admin" ? null : 1,
    permissions: role === "super_admin" ? ["*"] : [`${role}.*`],
  };
};
