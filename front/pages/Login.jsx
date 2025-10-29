import React, { useState } from "react";
import "../assets/styles/Login.css";
import { Link } from "react-router";

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
    <div className="login-page-swapp container-fluid">
      <div className="row justify-content-center align-items-center">
        {/* Columna izquierda - Logo */}
        <div className="col-12 col-md-5 d-flex flex-column justify-content-center align-items-center mb-5 mb-md-0">
          <Link className="logo-login-container" to="/">
            <img src="logo swapp.webp" alt="Swapp" className="logo-login" />
          </Link>

          <h4 className="slogan-login">¡Donde todo, tiene otro valor!</h4>
        </div>

        {/* Columna derecha - Formulario */}
        <div className="col-12 col-md-7 d-flex justify-content-center">
          <div className="login-box-swapp">
            <h5 className="form-title-login fw-bold mb-3">
              Inicia sesión en <span className="text-naranja">Swapp</span>
            </h5>

            {/* Botón Google */}
            <button
              type="button"
              className="btn-google-swapp mb-3 w-100 d-flex align-items-center justify-content-center gap-2"
              onClick={() => {
                window.location.href =
                  "http://localhost:5000/auth/google/login?next=/";
              }}
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google logo"
                width="20"
                height="20"
              />
              Iniciar sesión con Google
            </button>

            <form onSubmit={handleSubmit}>
              {/* Correo */}
              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control login-input-swapp"
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
                  className="form-control login-input-swapp"
                  placeholder="Ingresa tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
              </div>

              {error && (
                <div className="login-error-swapp text-danger mb-3">
                  {error}
                </div>
              )}

              {/* Botón principal */}
              <button type="submit" className="btn-login-swapp fw-bold w-100">
                Iniciar sesión
              </button>
            </form>

            <p className="mt-3 text-center">
              ¿No tienes cuenta?{" "}
              <a href="/registro" className="enlace-login-swapp">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
