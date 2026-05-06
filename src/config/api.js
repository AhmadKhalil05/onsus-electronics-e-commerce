const DEFAULT_BASE =
  "https://8ng9rwp0gj.execute-api.us-east-1.amazonaws.com/prod-SES-v1";
const DEFAULT_NEWSLETTER_ENDPOINT = "/newsletter/subscribe";
const DEFAULT_CONTACT_ENDPOINT = "/contact";
const DEFAULT_PRODUCTS_ENDPOINT = "/products";
const DEFAULT_ADMIN_PRODUCTS_ENDPOINT = "/admin";
const DEFAULT_WISHLIST_ENDPOINT = "/wishlist";
const DEFAULT_PROFILE_ENDPOINT = "/profile";
const DEFAULT_CART_ENDPOINT = "/cart";
const DEFAULT_UPLOAD_ENDPOINT = "/upload";

function trimTrailingSlash(url) {
  return String(url).replace(/\/+$/, "");
}

/** API Gateway stage base URL (override with VITE_API_BASE_URL). */
export const API_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE
);

/** Optional external endpoint for newsletter-only Lambda/API. */
export const NEWSLETTER_BASE_URL = trimTrailingSlash(
  import.meta.env.VITE_NEWSLETTER_BASE_URL || API_BASE_URL
);

/** API paths used by frontend services. */
export const API_ROUTES = {
  products: import.meta.env.VITE_PRODUCTS_ENDPOINT || DEFAULT_PRODUCTS_ENDPOINT,
  adminProducts:
    import.meta.env.VITE_ADMIN_PRODUCTS_ENDPOINT ||
    DEFAULT_ADMIN_PRODUCTS_ENDPOINT,
  wishlist: import.meta.env.VITE_WISHLIST_ENDPOINT || DEFAULT_WISHLIST_ENDPOINT,
  contact: import.meta.env.VITE_CONTACT_ENDPOINT || DEFAULT_CONTACT_ENDPOINT,
  profile: import.meta.env.VITE_PROFILE_ENDPOINT || DEFAULT_PROFILE_ENDPOINT,
  cart: import.meta.env.VITE_CART_ENDPOINT || DEFAULT_CART_ENDPOINT,
  upload: import.meta.env.VITE_UPLOAD_ENDPOINT || DEFAULT_UPLOAD_ENDPOINT,
  newsletter:
    import.meta.env.VITE_NEWSLETTER_ENDPOINT || DEFAULT_NEWSLETTER_ENDPOINT,
};
