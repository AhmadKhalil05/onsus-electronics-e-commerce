import { apiRequest } from "./http";

/**
 * Normalizes common API envelope shapes to a plain array of product records.
 * @param {unknown} data
 * @returns {object[]}
 */
export function parseProductsResponse(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const o = /** @type {Record<string, unknown>} */ (data);
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
  const data = await apiRequest("get", "/admin/products", {});
  return parseProductsResponse(data);
}

/**
 * @param {unknown} data
 * @returns {number | null}
 */
export function parseCreatedProductId(data) {
  if (data == null) return null;
  if (typeof data === "number" && Number.isFinite(data)) return data;
  if (typeof data === "object") {
    const o = /** @type {Record<string, unknown>} */ (data);
    const id = o.id ?? o.productId ?? o.product_id;
    if (id != null && Number.isFinite(Number(id))) return Number(id);
    const item = o.item;
    if (item && typeof item === "object") {
      const io = /** @type {Record<string, unknown>} */ (item);
      const iid = io.id;
      if (iid != null && Number.isFinite(Number(iid))) return Number(iid);
    }
  }
  return null;
}

/**
 * POST /admin/products
 * @param {Record<string, unknown>} payload
 */
export function createProductApi(payload) {
  return apiRequest("post", "/admin/products", { data: payload });
}

/**
 * PUT /admin/products/:id
 * @param {string | number} productId
 * @param {Record<string, unknown>} payload
 */
export function updateProductApi(productId, payload) {
  const id = encodeURIComponent(String(productId));
  return apiRequest("put", `/admin/products/${id}`, {
    data: { ...payload, id: productId },
  });
}
