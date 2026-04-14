import { apiRequest } from "./http";

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
          const n = Number(item);
          return Number.isFinite(n) ? n : NaN;
        }
        if (item && typeof item === "object") {
          const o = /** @type {Record<string, unknown>} */ (item);
          const id = o.productId ?? o.product_id ?? o.id;
          const n = Number(id);
          return Number.isFinite(n) ? n : NaN;
        }
        return NaN;
      })
      .filter((n) => Number.isFinite(n));
  }
  if (typeof data === "object") {
    const o = /** @type {Record<string, unknown>} */ (data);
    const nested = o.productIds ?? o.items ?? o.wishlist ?? o.data;
    if (nested !== undefined) return parseWishlistProductIds(nested);
  }
  return [];
}

/**
 * GET /wishlist?userId=… — Bearer from Amplify interceptor.
 * @param {string} userId Cognito `sub` (same as getCurrentUser().userId)
 */
export async function fetchWishlist(userId) {
  const data = await apiRequest("get", "/wishlist", {
    params: { userId },
  });
  return parseWishlistProductIds(data);
}

/**
 * POST /wishlist
 * @param {number} productId
 */
export function addWishlistItem(productId) {
  return apiRequest("post", "/wishlist", {
    data: { productId: Math.trunc(Number(productId)) },
  });
}

/**
 * DELETE /wishlist (JSON body)
 * @param {number} productId
 */
export function removeWishlistItem(productId) {
  return apiRequest("delete", "/wishlist", {
    data: { productId: Math.trunc(Number(productId)) },
  });
}
