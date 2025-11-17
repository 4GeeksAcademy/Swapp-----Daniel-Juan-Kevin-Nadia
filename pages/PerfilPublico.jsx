import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";
import ModalMensajeria from "../assets/components/ModalMensajeria";
import ModalIntercambio from "../assets/components/ModalIntercambio";
import "../assets/styles/PerfilPublico.css";
import { env } from "../environ";

  function PerfilPublico() {
    const { id_usuario } = useParams();
    const navigate = useNavigate();

    // Estados principales
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalIntercambio, setMostrarModalIntercambio] = useState(false);
    const [msg, setMsg] = useState(null);


    // Helper para obtener usuario autenticado 
    const getUsuarioActual = async () => {
      const rawToken = localStorage.getItem("token");
      const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;
      if (!token) return null;

      try {
        const res = await fetch(`${env.api}/api/autorizacion`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data; 
      } catch (err) {
        console.error("Error obteniendo usuario actual:", err);
        return null;
      }
    };


    //  Intercambios creados por el usuario público
    const [intercambios, setIntercambios] = useState([]);

    // Obtener datos del usuario
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

    // Obtener intercambios creados por este usuario (postulante)
    useEffect(() => {
      if (!id_usuario) return;

      const obtenerIntercambios = async () => {
        try {
          const res = await fetch(
            `${env.api}/api/intercambios/postulante/${id_usuario}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const text = await res.text();

          if (res.status === 404) {
            console.warn(" Usuario sin intercambios.");
            setIntercambios([]);
            return;
          }

          if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

          const data = JSON.parse(text);
          setIntercambios(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error("Error al cargar intercambios:", err);
          setIntercambios([]);
        }


      };

      obtenerIntercambios();
    }, [id_usuario]);


    // Contactar
    const handleContactar = () => {
      const usuarioLocal = localStorage.getItem("usuario");

      if (!usuarioLocal) {
        alert("⚠️ Debes iniciar sesión para contactar con otros usuarios.");
        navigate("/login");
        return;
      }

      // abrir modal en lugar de alerta
      setMostrarModal(true);
    };


// Unirse a un intercambio 
    const handleUnirse = async (id_intercambio) => {
      try {
        const yo = await getUsuarioActual(); // obtiene usuario actual con /api/autorizacion

        if (!yo?.id_usuario) {
          setMsg({
            tipo: "warning",
            contenido: "⚠️ Debes iniciar sesión para concretar un intercambio.",
          });
          setTimeout(() => setMsg(null), 4000);
          return;
        }

        const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");

        // Campo correcto según tu backend
        const body = {
          id_usuario: yo.id_usuario,
        };

        const res = await fetch(`${env.api}/api/intercambios/unirse/${id_intercambio}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al unirse al intercambio");

        // Mostrar mensaje real del backend
        setMsg({
          tipo: "success",
          contenido: `✅ ${data.mensaje || "Intercambio concretado correctamente."}`,
        });

        setTimeout(() => setMsg(null), 3000);
      } catch (err) {
        console.error("Error uniendo al intercambio:", err);
        setMsg({
          tipo: "danger",
          contenido: "❌ No se pudo concretar el intercambio.",
        });
        setTimeout(() => setMsg(null), 4000);
      }
    };



    if (cargando)
      return (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div
            className="spinner-border"
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

              {/* Botón Contactar */}
              <button
                className="btn btn-naranja mb-2"
                onClick={() => setMostrarModal(true)}
              >
                Contactar
              </button>

            </div>
          </div>

          {/* Contenido principal */}
          <div className="col-12 col-md-8 perfil-publico-content p-4 text-center">
            {/*  Descripción */}
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

            {/* Habilidades  */}
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

            {/* Intercambios creados por este usuario */}
            <h2 className="text-dark fw-bold mb-4 mt-5">Intercambios</h2>

            {intercambios.length === 0 ? (
              <p className="text-muted">
                Este usuario aún no ha creado intercambios.
              </p>
            ) : (
              <div className="tabla-intercambios-container mt-3">
                <table className="tabla-intercambios w-100">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Habilidad que busca</th>
                      <th>Estado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {intercambios.map((inter) => (
                      <tr key={inter.id_intercambio}>
                        <td>#{inter.id_intercambio}</td>
                        <td>{inter.habilidad?.nombre_habilidad || "—"}</td>
                        <td>{inter.estado || "Activo"}</td>
                        <td>
                          {localStorage.getItem("token") ? (
                            <button
                              className="btn btn-naranja btn-sm"
                              onClick={() => handleUnirse(inter.id_intercambio)}
                            >
                              Concretar intercambio
                            </button>
                          ) : (
                            <span className="text-muted">
                              Inicia sesión para unirte
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {msg && msg.contenido && (
                  <div className={`alert alert-${msg.tipo} text-center mt-3`} role="alert">
                    {msg.contenido}
                  </div>
                )}
              </div>
            )}
          </div>
          </div>
          </div>


      {/* Modal de mensajería */}
      {mostrarModal && (
        <ModalMensajeria
          mostrar={mostrarModal}
          cerrar={() => setMostrarModal(false)}
          receptorId={usuario.id_usuario} // PERFIL VISUALIZADO
        />
      )}



      <Footer />
    </>
  );
}

export default PerfilPublico;
