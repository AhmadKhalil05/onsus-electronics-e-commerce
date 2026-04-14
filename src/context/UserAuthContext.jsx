import { Hub } from "aws-amplify/utils";
import {
  fetchUserAttributes,
  getCurrentUser,
  signIn as amplifySignIn,
  signInWithRedirect,
  signOut as amplifySignOut,
} from "aws-amplify/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const authUser = await getCurrentUser();
      let email = authUser.signInDetails?.loginId ?? authUser.username;
      try {
        const attrs = await fetchUserAttributes();
        if (attrs.email) email = attrs.email;
      } catch {
        /* optional */
      }
      setUser({ authUser, email });
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      await loadUser();
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadUser]);

  useEffect(() => {
    const sub = Hub.listen("auth", ({ payload }) => {
      const { event } = payload;
      if (
        event === "signedIn" ||
        event === "signedOut" ||
        event === "tokenRefresh"
      ) {
        loadUser();
      }
    });
    return () => {
      if (typeof sub === "function") sub();
    };
  }, [loadUser]);

  const signInWithEmailPassword = useCallback(
    async (username, password) => {
      const out = await amplifySignIn({ username, password });
      const step = out.nextStep?.signInStep;
      if (step === "DONE") {
        await loadUser();
        return { ok: true };
      }
      return {
        ok: false,
        message: `Sign-in needs another step (${step}). Complete MFA or password change in Cognito if required.`,
        nextStep: out.nextStep,
      };
    },
    [loadUser]
  );

  const signInWithGoogle = useCallback(async () => {
    await signInWithRedirect({ provider: "Google" });
  }, []);

  const logout = useCallback(async () => {
    try {
      await amplifySignOut({ global: true });
    } catch {
      await amplifySignOut();
    }
    setUser(null);
  }, []);

  const redirectToLogin = useCallback(
    (nextPath) => {
      const next =
        nextPath ||
        (typeof window !== "undefined" ? window.location.pathname : "");
      const qs = next ? `?next=${encodeURIComponent(next)}` : "";
      navigate(`/login${qs}`);
    },
    [navigate]
  );

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user: user?.authUser ?? null,
      email: user?.email ?? null,
      /** Opens hosted UI Google IdP (requires OAuth config in amplify.js). */
      signInWithGoogle,
      /** Email/username + password — visible in Network as calls to Cognito. */
      signInWithEmailPassword,
      logout,
      /** @deprecated use signInWithEmailPassword or navigate to /login */
      login: () => redirectToLogin(),
      redirectToLogin,
      refreshUser: loadUser,
    }),
    [
      user,
      isLoading,
      signInWithGoogle,
      signInWithEmailPassword,
      logout,
      redirectToLogin,
      loadUser,
    ]
  );

  return (
    <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
}
