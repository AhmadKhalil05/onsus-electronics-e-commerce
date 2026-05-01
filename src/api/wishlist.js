import { apiRequest } from "./http";
import { API_ROUTES } from "@/config/api";

function toStringId(value) {
  if (value == null) return "";
  const id = String(value).trim();
  return id;
}

function tryParseJson(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function unwrapApiBody(data) {
  const first = tryParseJson(data);
  if (first && typeof first === "object" && !Array.isArray(first)) {
    const rec = /** @type {Record<string, unknown>} */ (first);
    if ("body" in rec) return tryParseJson(rec.body);
  }
  return first;
}

/**
 * @param {unknown} data
 * @returns {string[]}
 */
export function parseWishlistProductIds(data) {
  const unwrapped = unwrapApiBody(data);
  if (unwrapped == null) return [];
  if (Array.isArray(unwrapped)) {
    return unwrapped
      .map((item) => {
        if (typeof item === "string" && item.trim() !== "") return item.trim();
        if (typeof item === "number" && Number.isFinite(item)) return String(item);
        if (item && typeof item === "object") {
          const o = /** @type {Record<string, unknown>} */ (item);
          return toStringId(o.productId ?? o.product_id ?? o.id);
        }
        return "";
      })
      .filter(Boolean);
  }
  if (typeof unwrapped === "object") {
    const o = /** @type {Record<string, unknown>} */ (unwrapped);
    const directId = o.productId ?? o.product_id ?? o.id;
    if (directId != null) {
      const id = toStringId(directId);
      return id ? [id] : [];
    }
    const nested = o.productIds ?? o.items ?? o.wishlist ?? o.data;
    if (nested !== undefined) return parseWishlistProductIds(nested);
  }
  return [];
}

/**
 * GET /wishlist — Bearer from Amplify interceptor.
 */
export async function fetchWishlist() {
  const data = await apiRequest("get", API_ROUTES.wishlist, {});
  return Array.from(new Set(parseWishlistProductIds(data)));
}

/**
 * POST /wishlist with a single productId.
 * @param {string | number} productId
 */
export function addWishlistItem(productId) {
  return apiRequest("post", API_ROUTES.wishlist, {
    data: { productId: String(productId) },
  });
}

/**
 * DELETE /wishlist?productId=...
 * @param {string | number} productId
 */
export function removeWishlistItem(productId) {
  return apiRequest("delete", API_ROUTES.wishlist, {
    params: { productId: String(productId) },
  });
}
