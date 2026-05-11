"use client";

import Cookies from "js-cookie";
import { getDefaultRouteForRole, normalizeRole, rolePermissions, type AuthUser, type UserRole } from "./auth-contract";

const TOKEN_COOKIE = "token";
const ROLE_COOKIE = "user_role";
const USER_STORAGE_KEY = "user";
const ORIGINAL_SESSION_STORAGE_KEY = "original_super_admin_session";

type OriginalSession = {
  token: string;
  user: AuthUser;
};

export const saveSession = (token: string, user: AuthUser, remember = false) => {
  if (typeof window === "undefined") return;

  const expires = remember ? 30 : 7;
  const normalizedUser: AuthUser = {
    ...user,
    role: normalizeRole(user.role),
    permissions: user.permissions?.length ? user.permissions : rolePermissions[normalizeRole(user.role)],
  };

  Cookies.set(TOKEN_COOKIE, token, { expires });
  Cookies.set(ROLE_COOKIE, normalizedUser.role, { expires });
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
};

export const clearSession = () => {
  if (typeof window === "undefined") return;

  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(ROLE_COOKIE);
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ORIGINAL_SESSION_STORAGE_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser) as AuthUser;
    const role = normalizeRole(parsedUser.role);
    return {
      ...parsedUser,
      role,
      permissions: parsedUser.permissions?.length ? parsedUser.permissions : rolePermissions[role],
    };
  } catch {
    clearSession();
    return null;
  }
};

export const getStoredRole = (): UserRole => {
  const user = getStoredUser();
  return normalizeRole(user?.role || Cookies.get(ROLE_COOKIE));
};

export const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return Cookies.get(TOKEN_COOKIE) || null;
};

export const saveOriginalSession = (token: string, user: AuthUser) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORIGINAL_SESSION_STORAGE_KEY, JSON.stringify({ token, user }));
};

export const getOriginalSession = (): OriginalSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(ORIGINAL_SESSION_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as OriginalSession) : null;
  } catch {
    window.localStorage.removeItem(ORIGINAL_SESSION_STORAGE_KEY);
    return null;
  }
};

export const clearOriginalSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ORIGINAL_SESSION_STORAGE_KEY);
};

export const getStoredDefaultRoute = () => getDefaultRouteForRole(getStoredRole());
