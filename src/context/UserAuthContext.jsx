import React, { createContext, useContext } from "react";
import { useAuth } from "react-oidc-context";

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const auth = useAuth();

  const logout = () => {
    const clientId = "7vd64o8bjjqof0t2qh3la47ijg";
    const domain = "https://us-east-1drfqhopsp.auth.us-east-1.amazoncognito.com";
    const logoutUri = encodeURIComponent("http://localhost:5173");
    auth.removeUser();
    window.location.href = `${domain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  const value = {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    user: auth.user,
    email: auth.user?.profile?.email ?? null,
    login: () => auth.signinRedirect(),
    logout,
  };

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error("useUserAuth must be used within UserAuthProvider");
  return ctx;
}
