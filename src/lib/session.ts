"use client";

import Cookies from "js-cookie";
import { getDefaultRouteForRole, normalizeRole, type AuthUser, type UserRole } from "./auth-contract";

const TOKEN_COOKIE = "token";
const ROLE_COOKIE = "user_role";
const USER_STORAGE_KEY = "user";

export const saveSession = (token: string, user: AuthUser, remember = false) => {
  if (typeof window === "undefined") return;

  const expires = remember ? 30 : 7;
  Cookies.set(TOKEN_COOKIE, token, { expires });
  Cookies.set(ROLE_COOKIE, user.role, { expires });
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  if (typeof window === "undefined") return;

  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(ROLE_COOKIE);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getStoredUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser) as AuthUser;
    return {
      ...parsedUser,
      role: normalizeRole(parsedUser.role),
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

export const getStoredDefaultRoute = () => getDefaultRouteForRole(getStoredRole());
