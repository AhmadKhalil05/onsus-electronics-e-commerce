import React, { createContext, useContext, useMemo, useState } from "react";

const SESSION_KEY = "onsus_admin_session";

const adminAuthContext = createContext(null);

export function useAdminAuth() {
  const ctx = useContext(adminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}

const DEFAULT_PASSWORD =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_ADMIN_PASSWORD
    ? import.meta.env.VITE_ADMIN_PASSWORD
    : "REPLACE_WITH_STRONG_PASSWORD";

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() =>
    sessionStorage.getItem(SESSION_KEY)
  );

  const login = (password) => {
    if (password === DEFAULT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "ok");
      setSession("ok");
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  };

  const isAuthenticated = session === "ok";

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
    }),
    [isAuthenticated]
  );

  return (
    <adminAuthContext.Provider value={value}>
      {children}
    </adminAuthContext.Provider>
  );
}
