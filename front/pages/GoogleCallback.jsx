import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");
    const email = params.get("email");
    const picture = params.get("picture");

    console.log("Parámetros recibidos en el callback:");
    for (const [key, value] of params.entries()) {
      console.log(`${key}: ${value}`);
    }

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ name, email, picture }));

      console.log("Sesión iniciada con Google:", { name, email, picture });

      setTimeout(() => navigate("/perfil"), 200);
    } else {
      console.error("Error: token no encontrado en la URL");
      alert("Error al autenticar con Google. Intenta de nuevo.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h4>Autenticando con Google...</h4>
    </div>
  );
};

export default GoogleCallback;
