import { API_BASE_URL, PURCHASE_BASE_URL } from "@/config/api";
import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

const tokenType =
  import.meta.env.VITE_API_AUTH_TOKEN_TYPE === "access"
    ? "accessToken"
    : "idToken";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const purchaseClient = axios.create({
  baseURL: PURCHASE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const authInterceptor = async (config) => {
  try {
    const { tokens } = await fetchAuthSession();
    const token = tokens?.[tokenType];
    if (token) {
      const value =
        typeof token.toString === "function" ? token.toString() : String(token);
      if (value) {
        config.headers.Authorization = `Bearer ${value}`;
      }
    }
  } catch {
    /* guest — no Authorization header */
  }
  return config;
};

apiClient.interceptors.request.use(authInterceptor);
purchaseClient.interceptors.request.use(authInterceptor);

/**
 * @param {import("axios").AxiosRequestConfig} config
 * @param {string | undefined} idToken optional override (usually unnecessary; interceptor fills Bearer)
 */
export function withBearer(config, idToken) {
  if (!idToken) return config;
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${idToken}`,
    },
  };
}

/**
 * JSON request against the API. Authorization is attached automatically when signed in with Amplify.
 * You can still pass `idToken` to override the header for rare cases.
 * Token source is configurable with VITE_API_AUTH_TOKEN_TYPE=id|access.
 * @param {import("axios").Method} method
 * @param {string} path relative to API base (e.g. "/wishlist")
 * @param {{ data?: unknown, params?: Record<string, string>, idToken?: string }} [options]
 */
export async function apiRequest(method, path, options = {}) {
  const { data, params, idToken } = options;
  const res = await apiClient.request(
    withBearer({ method, url: path, data, params }, idToken)
  );
  return res.data;
}
