import React, { useState } from "react";
import "../assets/styles/Login.css";
import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setError("");

    try {
      const response = await fetch(
        "https://68e8dfb5f2707e6128cc97d2.mockapi.io/api/usuario"
      );

      if (!response.ok) {
        throw new Error("Error al conectar con el servidor");
      }

      const data = await response.json();

      const usuario = data.find(
        (u) =>
          u.correo_electronico === correo.trim() &&
          u.contrasena === contrasena.trim()
      );

      if (usuario) {
        localStorage.setItem("usuario", JSON.stringify(usuario));
        alert(`👋 Bienvenido ${usuario.nombre} ${usuario.apellidos}`);
        window.location.href = "/perfil";
      } else {
        setError("Correo o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("No se pudo conectar con la API.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-box container">
          <div className="text-center mb-4">
            <img src="logoSF.png" alt="Swapp" className="login-logo" />
            <h2 className="login-title fw-bold">Iniciar Sesión</h2>
          </div>

          <form onSubmit={handleSubmit} className="text-center">
            {/* Correo */}
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control login-input"
                placeholder="Ingresa tu correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control login-input"
                placeholder="Ingresa tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="login-error text-danger mb-3">{error}</div>
            )}

            {/* Botón */}
            <button type="submit" className="btn login-btn fw-bold">
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Login;
