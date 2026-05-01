import { API_ROUTES } from "@/config/api";
import { apiRequest } from "./http";

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
    if ("body" in rec) {
      return tryParseJson(rec.body);
    }
  }
  return first;
}

/**
 * @param {unknown} data
 * @returns {Array<{ productId: string, quantity: number }>}
 */
export function parseCartItems(data) {
  const unwrapped = unwrapApiBody(data);
  const source =
    Array.isArray(unwrapped)
      ? unwrapped
      : unwrapped && typeof unwrapped === "object"
        ? /** @type {Record<string, unknown>} */ (unwrapped).items ??
          /** @type {Record<string, unknown>} */ (unwrapped).cart ??
          /** @type {Record<string, unknown>} */ (unwrapped).data
        : [];
  if (!Array.isArray(source)) return [];
  return source
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const o = /** @type {Record<string, unknown>} */ (item);
      const idRaw = o.productId ?? o.product_id ?? o.id;
      const qtyRaw = o.quantity ?? 1;
      const productId = idRaw == null ? "" : String(idRaw).trim();
      const quantity = Math.max(1, Number(qtyRaw) || 1);
      if (!productId) return null;
      return { productId, quantity };
    })
    .filter(Boolean);
}

/** GET /cart for current authenticated user. */
export async function fetchCart() {
  const data = await apiRequest("get", API_ROUTES.cart, {});
  return parseCartItems(data);
}

/**
 * PUT /cart for current authenticated user.
 * @param {{ items: Array<{ productId: string | number, quantity: number }> }} payload
 */
export function updateCart(payload) {
  const items = Array.isArray(payload?.items)
    ? payload.items
        .map((item) => ({
          productId: String(item.productId),
          quantity: Math.max(1, Number(item.quantity) || 1),
        }))
        .filter((item) => item.productId.trim() !== "")
    : [];
  return apiRequest("put", API_ROUTES.cart, { data: { items } });
}

/** DELETE /cart for current authenticated user. */
export function clearCartApi() {
  return apiRequest("delete", API_ROUTES.cart, {});
}
