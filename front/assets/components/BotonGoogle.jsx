import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const BotonGoogle = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Usuario de Google:", decoded);

      // Redirige al backend Flask (que maneja el login real)
      window.location.href = "http://localhost:5000/auth/google/login";
    } catch (error) {
      console.error("Error en el login de Google:", error);
    }
  };

  const handleError = () => {
    console.error("Error al iniciar sesión con Google");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default BotonGoogle;
