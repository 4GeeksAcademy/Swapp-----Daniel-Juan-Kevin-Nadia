// front/assets/components/BotonGoogle.jsx
import React from "react";
import { env } from "../../environ";

const BotonGoogle = () => {
  const handleClick = () => {
    // Redirige al backend (Render o localhost según env.api)
    window.location.href = `${env.api}/auth/google/login`;
    // En local, env.api será http://localhost:5000
    // En producción, env.api será https://swapp-app-nw6o.onrender.com
  };

  return (
    <button
      type="button"
      className="btn-login-swapp fw-bold w-100 mb-3"
      onClick={handleClick}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        style={{ width: "18px", marginRight: "8px" }}
      />
      Iniciar sesión con Google
    </button>
  );
};

export default BotonGoogle;
