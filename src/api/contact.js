import { API_ROUTES, NEWSLETTER_BASE_URL } from "@/config/api";
import axios from "axios";
import { apiRequest } from "./http";

const newsletterClient = axios.create({
  baseURL: NEWSLETTER_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Contact form submission to API Gateway/Lambda.
 * @param {{ name: string, subject: string, message: string, email?: string }} payload
 */
export function sendContactMessage(payload) {
  return apiRequest("post", API_ROUTES.contact, { data: payload });
}

/**
 * Retrieves all contact form submissions (Admin only).
 * @returns {Promise<Array<{ contactId: string, timestamp: number, name: string, email?: string, subject: string, message: string }>>}
 */
export async function fetchContacts() {
  const data = await apiRequest("get", API_ROUTES.contact, {});
  // Data is expected to be an array or { items: [...] } based on Lambda response
  return Array.isArray(data) ? data : data?.items || [];
}

/**
 * Newsletter subscription endpoint.
 * Uses the same API base by default, or VITE_NEWSLETTER_BASE_URL when provided.
 * @param {string} email
 */
export function subscribeNewsletter(email) {
  return newsletterClient.post(API_ROUTES.newsletter, { email });
}
