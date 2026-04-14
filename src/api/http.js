import { API_BASE_URL } from "@/config/api";
import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const { tokens } = await fetchAuthSession();
    const idToken = tokens?.idToken;
    if (idToken) {
      const value =
        typeof idToken.toString === "function"
          ? idToken.toString()
          : String(idToken);
      if (value) {
        config.headers.Authorization = `Bearer ${value}`;
      }
    }
  } catch {
    /* guest — no Authorization header */
  }
  return config;
});

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
