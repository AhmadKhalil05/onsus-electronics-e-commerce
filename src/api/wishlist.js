import { apiRequest } from "./http";
import { API_ROUTES } from "@/config/api";

/**
 * @param {unknown} value
 * @returns {number}
 */
function toFiniteId(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : NaN;
}

/**
 * @param {unknown} data
 * @returns {number[]}
 */
export function parseWishlistProductIds(data) {
  if (data == null) return [];
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "number" && Number.isFinite(item)) return item;
        if (typeof item === "string" && item.trim() !== "") {
          return toFiniteId(item);
        }
        if (item && typeof item === "object") {
          const o = /** @type {Record<string, unknown>} */ (item);
          const id = o.productId ?? o.product_id ?? o.id;
          return toFiniteId(id);
        }
        return NaN;
      })
      .filter((n) => Number.isFinite(n));
  }
  if (typeof data === "object") {
    const o = /** @type {Record<string, unknown>} */ (data);
    const directId = o.productId ?? o.product_id ?? o.id;
    if (directId != null) {
      const n = toFiniteId(directId);
      return Number.isFinite(n) ? [n] : [];
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
  return parseWishlistProductIds(data);
}

/**
 * PUT /wishlist with full list (matches Lambda design keyed by userId claim).
 * @param {number[]} productIds
 */
export function replaceWishlist(productIds) {
  const items = Array.from(
    new Set((productIds || []).map((id) => toFiniteId(id)).filter(Number.isFinite))
  );
  return apiRequest("put", API_ROUTES.wishlist, {
    data: { items },
  });
}

/**
 * DELETE /wishlist (clears list for current user).
 */
export function clearWishlist() {
  return apiRequest("delete", API_ROUTES.wishlist, {});
}
