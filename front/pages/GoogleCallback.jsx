import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const id_usuario = params.get("id_usuario");
    const nombre = params.get("nombre") || "";
    const apellido = params.get("apellido") || "";
    const email = params.get("email") || "";
    const picture = params.get("picture") || "";

    console.log("👉 Parámetros que llegan desde Google:", {
      token,
      id_usuario,
      nombre,
      apellido,
      email,
      picture,
    });

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id_usuario,
          nombre,
          apellido,
          correo_electronico: email,
          foto_perfil: picture,
        })
      );

      setTimeout(() => navigate("/perfil"), 200);
    } else {
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
