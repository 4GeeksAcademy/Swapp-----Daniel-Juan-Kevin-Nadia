import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="1024723839431-3ascshnm9j4gr5kparoegh2kfu227mot.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
