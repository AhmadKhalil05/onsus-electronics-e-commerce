import { fetchAuthSession } from "aws-amplify/auth";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useUserAuth } from "./UserAuthContext";

const adminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(adminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

function parseGroupsFromPayload(payload) {
  const raw = payload?.["cognito:groups"];
  if (Array.isArray(raw)) {
    return raw.map((g) => String(g));
  }
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(",")
      .map((g) => g.trim())
      .filter(Boolean);
  }
  return [];
}

export function AdminAuthProvider({ children }) {
  const {
    isAuthenticated: userSignedIn,
    isLoading: userLoading,
    signInWithEmailPassword,
    logout: userLogout,
    refreshUser,
  } = useUserAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const refreshAdmin = useCallback(async () => {
    setIsChecking(true);
    try {
      const { tokens } = await fetchAuthSession();
      const idTokenGroups = parseGroupsFromPayload(tokens?.idToken?.payload);
      const accessTokenGroups = parseGroupsFromPayload(tokens?.accessToken?.payload);
      const groups = [...new Set([...idTokenGroups, ...accessTokenGroups])];
      const inAdminGroup = groups.includes("admin");
      setIsAdmin(inAdminGroup);
      return inAdminGroup;
    } catch {
      setIsAdmin(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (userLoading) return;
    refreshAdmin();
  }, [userLoading, refreshAdmin]);

  const login = useCallback(
    async (username, password) => {
      const signInResult = await signInWithEmailPassword(username, password);
      if (!signInResult?.ok) return signInResult;
      await refreshUser();
      const inAdminGroup = await refreshAdmin();
      if (!inAdminGroup) {
        await userLogout();
        return {
          ok: false,
          message: "Access denied. This account is not in the admin group.",
        };
      }
      return { ok: true };
    },
    [refreshAdmin, refreshUser, signInWithEmailPassword, userLogout]
  );

  const logout = useCallback(async () => {
    await userLogout();
    setIsAdmin(false);
  }, [userLogout]);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated: userSignedIn && isAdmin,
      isChecking: userLoading || isChecking,
      isSignedIn: userSignedIn,
      refreshAdmin,
    }),
    [isAdmin, isChecking, login, logout, refreshAdmin, userLoading, userSignedIn]
  );

  return (
    <adminAuthContext.Provider value={value}>
      {children}
    </adminAuthContext.Provider>
  );
}
