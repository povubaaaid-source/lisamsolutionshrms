import axios from "axios";
import Cookies from "js-cookie";
import { normalizeApiPath } from "./api-contract";
import { isMockApiEnabled, mockApiAdapter } from "./mock-api";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || 5000),
  adapter: isMockApiEnabled() ? mockApiAdapter : undefined,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Frontend-Client": "nextjs-ui",
    "X-Api-Mode": isMockApiEnabled() ? "mock" : "live",
  },
});

api.interceptors.request.use((config) => {
  config.url = normalizeApiPath(config.url);

  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.warn(`API Network Error: The PHP backend at ${API_URL} is not reachable.`);
    }

    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user_role");
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("user");
      }
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
