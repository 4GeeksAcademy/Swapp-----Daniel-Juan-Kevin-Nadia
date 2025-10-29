import React, { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/auth/google/callback" + window.location.search
        );
        const data = await response.json();

        // Guarda los datos en el almacenamiento local
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirige al perfil o home
        window.location.href = "/";
      } catch (error) {
        console.error("Error procesando callback de Google:", error);
      }
    };

    fetchUserData();
  }, []);

  return <p>Conectando con Google...</p>;
};

export default GoogleCallback;
