import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* 🔽 Envolvemos App con el Provider de Google */}
      <GoogleOAuthProvider clientId="TU_CLIENT_ID_DE_GOOGLE">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
