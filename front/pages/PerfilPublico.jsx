import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";
import ModalMensajeria from "../assets/components/ModalMensajeria"; // ✅ importar el modal
import "../assets/styles/PerfilPublico.css";
import { env } from "../environ";

function PerfilPublico() {
  const { id_usuario } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const res = await fetch(`${env.api}/api/usuarios/${id_usuario}`);
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el perfil del usuario.");
      } finally {
        setCargando(false);
      }
    };

    fetchUsuario();
  }, [id_usuario]);

  const handleContactar = () => {
    const usuarioLocal = localStorage.getItem("usuario");

    if (!usuarioLocal) {
      alert("⚠️ Debes iniciar sesión para contactar con otros usuarios.");
      navigate("/login");
      return;
    }

    // ✅ abrir modal en lugar de alerta
    setMostrarModal(true);
  };

  if (cargando)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div
          className="spinner-border "
          style={{ color: "#ff7517" }}
          role="status"
        >
          <span className="visually-hidden"></span>
        </div>
        <h4 className="mt-3">Cargando perfil...</h4>
      </div>
    );
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container-fluid perfil-publico-container py-5">
        <div className="row justify-content-center">
          {/* Sidebar */}
          <div className="col-12 col-md-3 perfil-publico-sidebar text-center p-4">
            <div className="perfil-publico-avatar-container">
              <img
                src={usuario.foto_perfil || "/swapp-profile.png"}
                alt="Foto de perfil"
                className="perfil-publico-avatar mb-3"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  aspectRatio: "1/1",
                }}
              />
              <h4 className="perfil-publico-nombre mb-4">
                {usuario.nombre} {usuario.apellido}
              </h4>
              <button
                className="btn btn-naranja"
                onClick={() => setMostrarModal(true)}
              >
                Contactar
              </button>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-12 col-md-8 perfil-publico-content p-4 text-center">
            <h2 className="text-dark fw-bold mb-4">Descripción</h2>
            <p>
              {usuario.descripcion ? (
                usuario.descripcion
              ) : (
                <span className="text-muted">
                  Este usuario no tiene una descripción.
                </span>
              )}
            </p>
            <h2 className="text-dark fw-bold mb-4">Habilidades</h2>

            {usuario.habilidades && usuario.habilidades.length > 0 ? (
              <div className="habilidades-contenedor">
                {usuario.habilidades.map((hab, index) => (
                  <div key={index} className="habilidad-card">
                    <div className="habilidad-nombre">
                      <h5>{hab?.nombre_habilidad || "Sin nombre"}</h5>
                    </div>
                    <div className="habilidad-descripcion">
                      <p>{hab?.descripcion || "Sin descripción"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">
                Este usuario aún no ha agregado habilidades.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Modal de mensajería */}
      {mostrarModal && (
        <ModalMensajeria
          mostrar={mostrarModal}
          cerrar={() => setMostrarModal(false)}
          receptorId={usuario.id_usuario} // <-- ESTE ES EL PERFIL VISUALIZADO
        />
      )}

      <Footer />
    </>
  );
}

export default PerfilPublico;
