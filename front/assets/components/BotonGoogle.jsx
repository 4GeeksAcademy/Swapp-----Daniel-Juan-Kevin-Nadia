import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const BotonGoogle = () => {
  const handleSuccess = () => {
    const handleSuccess = async (credentialResponse) => {
      const tokenGoogle = credentialResponse.credential;

      const res = await fetch(
        "https://swapp-app-nw6o.onrender.com/api/auth/google",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token_google: tokenGoogle }),
        }
      );

      const data = await res.json();

      if (data?.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/perfil";
      } else {
        console.log("Error en backend", data);
      }
    };
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
