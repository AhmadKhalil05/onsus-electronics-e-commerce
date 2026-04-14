import { Amplify } from "aws-amplify";

/** @type {string} */
const userPoolId =
  import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "us-east-1_dRfqHOPSp";

/** @type {string} */
const userPoolClientId =
  import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ??
  "7vd64o8bjjqof0t2qh3la47ijg";

/**
 * Hosted UI domain (no https://). Enables Google / social via signInWithRedirect.
 * Override with VITE_COGNITO_HOSTED_UI_DOMAIN if your domain differs.
 */
const hostedUiDomain =
  import.meta.env.VITE_COGNITO_HOSTED_UI_DOMAIN ??
  "us-east-1drfqhopsp.auth.us-east-1.amazoncognito.com";

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

export { userPoolClientId, userPoolId };
