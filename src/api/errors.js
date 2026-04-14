/**
 * Human-readable message from axios/network errors or API JSON bodies.
 * @param {unknown} error
 * @param {string} [fallback]
 */
export function formatApiError(error, fallback = "Something went wrong.") {
  if (error == null) return fallback;

  const res =
    error && typeof error === "object" && "response" in error
      ? /** @type {{ response?: { data?: unknown; status?: number; statusText?: string } }} */ (
          error
        ).response
      : undefined;
  const data = res?.data;

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    const o = /** @type {Record<string, unknown>} */ (data);
    const msg = o.message ?? o.error ?? o.detail ?? o.title;
    if (typeof msg === "string" && msg.trim()) return msg.trim();
    try {
      return JSON.stringify(data);
    } catch {
      return fallback;
    }
  }

  if (res?.status != null) {
    const statusText =
      typeof res.statusText === "string" && res.statusText
        ? ` ${res.statusText}`
        : "";
    return `${fallback} (HTTP ${res.status}${statusText})`.trim();
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * @param {string} context e.g. "Load products"
 * @param {unknown} error
 */
export function showApiError(context, error) {
  const detail = formatApiError(
    error,
    "The server did not return a usable error message."
  );
  window.alert(`${context}\n\n${detail}`);
}
