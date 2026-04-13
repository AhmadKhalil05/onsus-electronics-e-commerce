import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "./config/cognito.js";
import { UserAuthProvider } from "./context/UserAuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <UserAuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserAuthProvider>
    </AuthProvider>
  </StrictMode>
);
