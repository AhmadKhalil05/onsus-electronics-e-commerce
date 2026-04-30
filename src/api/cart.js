import { API_ROUTES } from "@/config/api";
import { apiRequest } from "./http";

/** GET /cart for current authenticated user. */
export function fetchCart() {
  return apiRequest("get", API_ROUTES.cart, {});
}

/**
 * PUT /cart for current authenticated user.
 * @param {{ items: Array<{ productId: number, quantity: number }> }} payload
 */
export function updateCart(payload) {
  return apiRequest("put", API_ROUTES.cart, { data: payload });
}

/** DELETE /cart for current authenticated user. */
export function clearCartApi() {
  return apiRequest("delete", API_ROUTES.cart, {});
}
