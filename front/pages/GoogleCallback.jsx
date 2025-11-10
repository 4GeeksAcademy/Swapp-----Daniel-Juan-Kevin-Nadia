import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

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
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          alert("⚠️ El token de autenticación ha expirado. Por favor, inicia sesión de nuevo.");
          navigate("/login");
          return;
        }

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

        console.log("✅ Token válido, redirigiendo al perfil...");

        setTimeout(() => navigate("/perfil"), 300);
      } catch (err) {
        console.error("❌ Error al decodificar el token:", err);
        alert("Error al procesar el token de Google. Intenta de nuevo.");
        navigate("/login");
      }
    } else {
      alert("❌ No se recibió token de autenticación. Intenta de nuevo.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h4>Autenticando con Google...</h4>
      <p>Por favor, espera un momento...</p>
    </div>
  );
};

export default GoogleCallback;
