import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const BotonGoogle = () => {
  const handleSuccess = () => {
    window.location.href = "http://localhost:5000/auth/google/login";
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
