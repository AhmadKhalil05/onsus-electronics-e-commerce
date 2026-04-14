const DEFAULT_BASE =
  "https://32mk1wn6mk.execute-api.us-east-1.amazonaws.com/onsus-stage";

function trimTrailingSlash(url) {
  return String(url).replace(/\/+$/, "");
}

/** API Gateway stage base URL (override with VITE_API_BASE_URL). */
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
);
