import { Amplify } from "aws-amplify";

/** @type {string} */
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "us-east-1_ciyrFjq4V";

/** @type {string} */
const userPoolClientId = import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ?? "XXXXXXXXXXXXXXXXXXXXXX";

/**
 * Hosted UI domain (no https://). Enables Google / social via signInWithRedirect.
 * Override with VITE_COGNITO_HOSTED_UI_DOMAIN if your domain differs.
 */
const hostedUiDomain =
  import.meta.env.VITE_COGNITO_HOSTED_UI_DOMAIN ?? "us-east-1ciyrfjq4v.auth.us-east-1.amazoncognito.com";

const origin =
  typeof window !== "undefined"
    ? `${window.location.origin}/`
    : "http://localhost:5173/";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        email: true,
        oauth: {
          domain: hostedUiDomain.replace(/^https?:\/\//, ""),
          scopes: ["openid", "email", "profile"],
          redirectSignIn: [origin],
          redirectSignOut: [origin],
          responseType: "code",
        },
      },
    },
  },
});

if (!userPoolId || !userPoolClientId || !hostedUiDomain) {
  console.warn(
    "Cognito env vars are missing. Set VITE_COGNITO_USER_POOL_ID, VITE_COGNITO_USER_POOL_CLIENT_ID, and VITE_COGNITO_HOSTED_UI_DOMAIN."
  );
}

export { userPoolClientId, userPoolId };
