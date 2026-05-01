import { apiRequest } from "./http";
import { API_ROUTES } from "@/config/api";

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
 * Normalizes common API envelope shapes to a plain array of product records.
 * @param {unknown} data
 * @returns {object[]}
 */
export function parseProductsResponse(data) {
  const unwrapped = unwrapApiBody(data);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && typeof unwrapped === "object") {
    const o = /** @type {Record<string, unknown>} */ (unwrapped);
    if (Array.isArray(o.items)) return o.items;
    if (Array.isArray(o.products)) return o.products;
    if (Array.isArray(o.data)) return o.data;
  }
  return [];
}

/**
 * GET /admin/products — Bearer ID token attached via axios interceptor when signed in.
 */
export async function fetchProducts() {
  try {
    const data = await apiRequest("get", API_ROUTES.products, {});
    return parseProductsResponse(data);
  } catch (err) {
    const status =
      err && typeof err === "object" && "response" in err
        ? /** @type {{ response?: { status?: number } }} */ (err).response?.status
        : undefined;
    if (status === 401 || status === 403 || status === 404) {
      const fallback = await apiRequest("get", API_ROUTES.adminProducts, {});
      return parseProductsResponse(fallback);
    }
    throw err;
  }
}

/**
 * @param {unknown} data
 * @returns {number | null}
 */
export function parseCreatedProductId(data) {
  const unwrapped = unwrapApiBody(data);
  if (unwrapped == null) return null;
  if (typeof unwrapped === "number" && Number.isFinite(unwrapped)) {
    return String(unwrapped);
  }
  if (typeof unwrapped === "string" && unwrapped.trim()) return unwrapped.trim();
  if (typeof unwrapped === "object") {
    const o = /** @type {Record<string, unknown>} */ (unwrapped);
    const id = o.id ?? o.productId ?? o.product_id;
    if (id != null && String(id).trim()) return String(id).trim();
    const item = o.item;
    if (item && typeof item === "object") {
      const io = /** @type {Record<string, unknown>} */ (item);
      const iid = io.id ?? io.productId;
      if (iid != null && String(iid).trim()) return String(iid).trim();
    }
  }
  return null;
}

/**
 * POST /admin/products
 * @param {Record<string, unknown>} payload
 * @param {string} [idToken]
 */
export function createProductApi(payload, idToken) {
  return apiRequest("post", API_ROUTES.adminProducts, { data: payload, idToken });
}

/**
 * PUT /admin/products/:id
 * @param {string | number} productId
 * @param {Record<string, unknown>} payload
 * @param {string} [idToken]
 */
export function updateProductApi(productId, payload, idToken) {
  return apiRequest("put", API_ROUTES.adminProducts, {
    params: { productId: String(productId) },
    data: payload,
    idToken,
  });
}

/**
 * DELETE /admin?productId=...
 * @param {string | number} productId
 * @param {string} [idToken]
 */
export function deleteProductApi(productId, idToken) {
  return apiRequest("delete", API_ROUTES.adminProducts, {
    params: { productId: String(productId) },
    idToken,
  });
}
