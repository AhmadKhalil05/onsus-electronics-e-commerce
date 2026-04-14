import { fetchAuthSession } from "aws-amplify/auth";

/**
 * Cognito ID token string for API Gateway JWT authorizer (Bearer).
 * @returns {Promise<string | undefined>}
 */
export async function getCognitoIdToken() {
  try {
    const { tokens } = await fetchAuthSession();
    const idToken = tokens?.idToken;
    if (!idToken) return undefined;
    return typeof idToken.toString === "function"
      ? idToken.toString()
      : String(idToken);
  } catch {
    return undefined;
  }
}

/**
 * Ensures a valid ID token exists; otherwise redirects to login.
 * @param {{ navigate: (path: string) => void, nextPath?: string }} options
 * @returns {Promise<string | null>} JWT or null after scheduling redirect
 */
export async function requireIdTokenOrRedirect({ navigate, nextPath = "" }) {
  const token = await getCognitoIdToken();
  if (token) return token;
  const next =
    nextPath || (typeof window !== "undefined" ? window.location.pathname : "");
  const qs = next ? `?next=${encodeURIComponent(next)}` : "";
  navigate(`/login${qs}`);
  return null;
}
