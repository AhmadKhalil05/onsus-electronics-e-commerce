import { API_ROUTES } from "@/config/api";
import { apiRequest } from "./http";

/** GET /profile for current authenticated user. */
export function fetchProfile() {
  return apiRequest("get", API_ROUTES.profile, {});
}

/**
 * PUT /profile for current authenticated user.
 * @param {{ name?: string, email?: string, address?: string }} payload
 */
export function updateProfile(payload) {
  return apiRequest("put", API_ROUTES.profile, { data: payload });
}
