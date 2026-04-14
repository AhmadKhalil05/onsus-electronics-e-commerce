import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext.jsx";
import "./config/amplify.js";
import "aws-amplify/auth/enable-oauth-listener";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
