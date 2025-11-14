import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const refresh = params.get("refresh_token");
    const id_usuario = params.get("id_usuario");

    console.log("👉 Parámetros recibidos desde backend:", {
      token,
      refresh,
      id_usuario,
    });

    if (!token || !id_usuario) {
      alert("❌ No se recibió la información necesaria. Intenta de nuevo.");
      navigate("/login");
      return;
    }

    // Guardar tokens
    localStorage.setItem("token", token);
    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }

    // Guardamos temporalmente el id_usuario
    localStorage.setItem("id_usuario", id_usuario);

    // 🧠 Ahora obtenemos el usuario REAL desde el backend
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/usuarios/${id_usuario}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          console.error("❌ Error al obtener user:", data);
          alert("No se pudo obtener tu información. Intenta de nuevo.");
          navigate("/login");
          return;
        }

        // Guardamos toda la info en localStorage
        localStorage.setItem("user", JSON.stringify(data));

        console.log("✅ Usuario cargado correctamente:", data);

        setTimeout(() => navigate("/perfil"), 300);
      })
      .catch((err) => {
        console.error("❌ Error en fetch usuario:", err);
        alert("Hubo un problema obteniendo tus datos.");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h4>Autenticando con Google...</h4>
      <p>Por favor, espera un momento...</p>
    </div>
  );
};

export default GoogleCallback;
