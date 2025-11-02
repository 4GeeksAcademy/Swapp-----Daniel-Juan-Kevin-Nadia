import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";
import "../assets/styles/PerfilUsuario.css";
import { env } from "../environ";
import { useStore } from "../hooks/useStore";

// Componentes existentes en tu proyecto
import BotonMensajeria from "../assets/components/BotonMensajeria";
import ModalMensajeria from "../assets/components/ModalMensajeria";
import ModalAgregarHabilidad from "../assets/components/ModalAgregarHabilidad";
import ModalPuntuacion from "../assets/components/ModalPuntuacion";

function PerfilUsuario() {
  const { _, dispatch } = useStore();

  // ======= Estado base =======
  const [usuario, setUsuario] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState("datos");

  // Datos Personales
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [msg, setMsg] = useState({});

  // Habilidades
  const [editandoHabilidades, setEditandoHabilidades] = useState(false);
  const [mostrarModalHabilidad, setMostrarModalHabilidad] = useState(false);

  // Mensajería
  const [mostrarMensajeria, setMostrarMensajeria] = useState(false);

  // Puntuación / Intercambios
  const [mostrarModalPuntuacion, setMostrarModalPuntuacion] = useState(false);
  const [usuarioEvaluado, setUsuarioEvaluado] = useState(null);

  const navigate = useNavigate();

  // ======= Utilidades =======
  const getTokenLimpio = () => {
    const raw = localStorage.getItem("token");
    return raw ? raw.replace(/^"|"$/g, "") : null;
  };

  const refreshUsuario = useCallback(async () => {
    // Cuando necesites el usuario completo/actualizado
    try {
      if (!usuario?.id_usuario) return;
      const res = await fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`);
      if (!res.ok) throw new Error("No se pudo refrescar el usuario");
      const data = await res.json();
      setUsuario(data);
      dispatch({ type: "SET_USUARIO", payload: data });
    } catch (err) {
      console.error("Error refrescando usuario:", err);
    }
  }, [usuario?.id_usuario, dispatch]);

  // ======= Efecto inicial: autorización + usuario =======
  useEffect(() => {
    const usuarioToken = getTokenLimpio();
    if (!usuarioToken) {
      alert("⚠️ No hay sesión activa. Por favor inicia sesión.");
      navigate("/login");
      return;
    }

    const fetchUsuarioAut = async () => {
      try {
        const response = await fetch(`${env.api}/api/autorizacion`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${usuarioToken}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          console.error("Error al obtener usuario:", response.status);
          return;
        }
        const data = await response.json();
        setUsuario(data);
        setFormData(data);
        dispatch({ type: "SET_USUARIO", payload: data });
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };

    fetchUsuarioAut();
  }, [navigate, dispatch]);

  // ======= Handlers Datos Personales =======
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGuardarDatos = async () => {
    try {
      // Comprobaciones mínimas (como en demo)
      if (!formData.nombre || !formData.apellido || !formData.correo_electronico) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
      }

      // Fecha final (año-mes-día)
      let fechaFinal = formData.fecha_nacimiento;
      if (formData.dia && formData.mes && formData.anio) {
        if (!formData.dia || !formData.mes || !formData.anio) {
          alert("Por favor selecciona día, mes y año.");
          return;
        }
        fechaFinal = `${formData.anio}-${String(formData.mes).padStart(2, "0")}-${String(
          formData.dia
        ).padStart(2, "0")}`;
      }

      const { dia, mes, anio, ...dataSinCamposExtra } = formData;
      const usuarioActualizado = {
        ...dataSinCamposExtra,
        fecha_nacimiento: fechaFinal,
      };

      const response = await fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioActualizado),
      });

      const data = await response.json();
      setUsuario(data?.actualizado);
      dispatch({ type: "SET_USUARIO", payload: data?.actualizado });
      setEditando(false);
      setMsg({ tipo: "success", contenido: data.msj });
    } catch (error) {
      console.error("Error al guardar:", error);
      setMsg({ tipo: "danger", contenido: "Error al guardar datos" });
    }
  };

  const handleEditarFoto = async () => {
    const nuevaFoto = prompt("Introduce la nueva URL de la foto de perfil:");
    if (!nuevaFoto) return;

    try {
      const response = await fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...usuario, foto_perfil: nuevaFoto }),
      });
      const actualizado = await response.json();
      setUsuario(actualizado);
      setFormData((prev) => ({ ...prev, foto_perfil: nuevaFoto }));
      setMsg({ tipo: "success", contenido: "Foto actualizada correctamente" });
    } catch (error) {
      console.error("Error al actualizar foto:", error);
      setMsg({ tipo: "danger", contenido: "No se pudo actualizar la foto" });
    }
  };

  // ======= Handlers Habilidades =======
  const entrarHabilidades = async () => {
    setSeccionActiva("habilidades");
    // Siempre refrescar desde backend al entrar a Habilidades (corrige lo que reportaste)
    try {
      const res = await fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`);
      const data = await res.json();
      setUsuario(data);
    } catch (error) {
      console.error("Error al recargar habilidades:", error);
    }
  };

  const handleEliminarHabilidad = async (idHabilidad) => {
    if (!window.confirm("¿Eliminar esta habilidad?")) return;
    try {
      const response = await fetch(
        `${env.api}/api/usuarios/${usuario.id_usuario}/habilidad/${idHabilidad}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        // Refresco local inmediato
        setUsuario((prev) => ({
          ...prev,
          habilidades: prev.habilidades.filter((h) => h.id_habilidad !== idHabilidad),
        }));
      } else {
        console.error("DELETE habilidad no OK:", response.status);
      }
    } catch (error) {
      console.error("Error eliminando habilidad:", error);
    }
  };

  const handleGuardarHabilidades = async () => {
    try {
      // Patrón de sincronización: refresco desde backend para asegurar estado correcto
      await refreshUsuario();
      setEditandoHabilidades(false);
    } catch (error) {
      console.error("Error guardando habilidades:", error);
      alert("❌ Error al guardar habilidades");
    }
  };

  // ======= Intercambios / Puntuación =======
  const abrirModalPuntuacion = (userDestino) => {
    setUsuarioEvaluado(userDestino);
    setMostrarModalPuntuacion(true);
  };

  const handleEnviarPuntuacion = async (payload) => {
    try {
      const res = await fetch(`${env.api}/api/intercambios/puntuacion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error puntuación");
      alert("✅ ¡Puntuación enviada con éxito!");
    } catch (err) {
      console.error("Error enviando puntuación:", err);
      alert("❌ Error al enviar la puntuación");
    } finally {
      setMostrarModalPuntuacion(false);
    }
  };

  if (!usuario) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <>
      <Navbar />

      <div className="container-fluid perfil-container py-5">
        <div className="row justify-content-center">
          {/* ======= Sidebar ======= */}
          <div className="col-12 col-md-3 perfil-sidebar text-center p-4">
            <div className="perfil-avatar-container">
              <img
                src={
                  usuario.foto_perfil && usuario.foto_perfil.trim() !== ""
                    ? usuario.foto_perfil
                    : "/swapp-profile.png"
                }
                alt="Foto de perfil"
                className="perfil-avatar mb-3"
              />
              <button className="btn btn-editar-foto mb-2" onClick={handleEditarFoto}>
                📷 Editar Foto
              </button>
              <h4 className="perfil-nombre mb-4">
                {usuario.nombre} {usuario.apellido}
              </h4>
            </div>

            <div className="perfil-secciones mt-4">
              <button
                className={`list-group-item ${seccionActiva === "datos" ? "active" : ""}`}
                onClick={() => setSeccionActiva("datos")}
              >
                Datos Personales
              </button>

              <div className="perfil-divider"></div>

              <button
                className={`list-group-item ${
                  seccionActiva === "habilidades" ? "active" : ""
                }`}
                onClick={entrarHabilidades}
              >
                Habilidades
              </button>

              <div className="perfil-divider"></div>

              <button
                className={`list-group-item ${
                  seccionActiva === "intercambios" ? "active" : ""
                }`}
                onClick={() => setSeccionActiva("intercambios")}
              >
                Intercambios
              </button>
            </div>
          </div>

          {/* ======= Contenido ======= */}
          <div className="col-12 col-md-8 perfil-content p-4">

            {/* === DATOS PERSONALES === */}
            {seccionActiva === "datos" && (
              <>
                <h2 className="text-dark fw-bold mb-4 text-center">Datos Personales</h2>

                <form className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={formData.nombre || ""}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Apellidos</label>
                    <input
                      type="text"
                      className="form-control"
                      name="apellido"
                      value={formData.apellido || ""}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Correo electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      name="correo_electronico"
                      value={formData.correo_electronico || ""}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>

                  {/* Fecha de nacimiento */}
                  <div className="col-md-6">
                    <label className="form-label">Fecha de nacimiento</label>
                    {editando ? (
                      <div className="d-flex" style={{ gap: "10px" }}>
                        {/* Día */}
                        <select
                          className="form-select"
                          name="dia"
                          value={formData.dia || ""}
                          onChange={handleChange}
                        >
                          <option value="">Día</option>
                          {[...Array(31)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>

                        {/* Mes (bloque exacto que pediste mantener) */}
                        <select
                          className="form-select"
                          name="mes"
                          value={formData.mes || ""}
                          onChange={handleChange}
                        >
                          <option value="">Mes</option>
                          {[
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Diciembre",
                          ].map((mes, i) => (
                            <option key={i + 1} value={i + 1}>
                              {mes}
                            </option>
                          ))}
                        </select>

                        {/* Año */}
                        <select
                          className="form-select"
                          name="anio"
                          value={formData.anio || ""}
                          onChange={handleChange}
                        >
                          <option value="">Año</option>
                          {Array.from(
                            { length: 100 },
                            (_, i) => new Date().getFullYear() - i
                          ).map((anio) => (
                            <option key={anio} value={anio}>
                              {anio}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={usuario.fecha_nacimiento?.split("T")[0] || ""}
                        disabled
                      />
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Género</label>
                    {editando ? (
                      <select
                        name="genero"
                        className="form-select"
                        value={formData.genero || ""}
                        onChange={handleChange}
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Personalizado">Personalizado</option>
                      </select>
                    ) : (
                      <input type="text" className="form-control" value={usuario.genero} disabled />
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={formData.descripcion || ""}
                      onChange={handleChange}
                      disabled={!editando}
                      rows="3"
                    />
                  </div>

                  {Object.keys(msg).length > 0 && (
                    <div className={`alert alert-${msg.tipo}`} role="alert">
                      {msg.contenido}
                    </div>
                  )}

                  <div className="col-12 text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-lg perfil-accion-btn"
                      onClick={editando ? handleGuardarDatos : () => setEditando(true)}
                    >
                      {editando ? "Guardar Cambios" : "Editar Información"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* === HABILIDADES === */}
            {seccionActiva === "habilidades" && (
              <>
                <h2 className="fw-bold mb-4 text-center">Habilidades</h2>

                {!editandoHabilidades ? (
                  <>
                    {usuario.habilidades && usuario.habilidades.length > 0 ? (
                      <div className="habilidades-contenedor">
                        {usuario.habilidades.map((hab) => (
                          <div key={hab.id_habilidad} className="habilidad-card">
                            <div className="habilidad-nombre">
                              <h5>{hab.nombre_habilidad}</h5>
                            </div>
                            <div className="habilidad-descripcion">
                              <p>{hab.descripcion?.trim() ? hab.descripcion : "Sin descripción"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted text-center">Aún no has agregado habilidades.</p>
                    )}

                    <div className="text-center mt-3">
                      <button
                        className="btn perfil-accion-btn"
                        onClick={() => setEditandoHabilidades(true)}
                      >
                        ✏️ Editar habilidades
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Modo edición: eliminar + agregar + guardar */}
                    {usuario.habilidades && usuario.habilidades.length > 0 && (
                      <div className="habilidades-contenedor">
                        {usuario.habilidades.map((hab) => (
                          <div
                            key={hab.id_habilidad}
                            className="habilidad-card d-flex justify-content-between align-items-center"
                          >
                            <div>
                              <h5>{hab.nombre_habilidad}</h5>
                              <p>{hab.descripcion?.trim() ? hab.descripcion : "Sin descripción"}</p>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleEliminarHabilidad(hab.id_habilidad)}
                              title="Eliminar habilidad"
                            >
                              ✖
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div
                      className="d-flex justify-content-center gap-3 mt-4"
                      style={{ flexWrap: "wrap" }}
                    >
                      <button
                        className="btn btn-editar-foto"
                        onClick={() => setMostrarModalHabilidad(true)}
                      >
                        ➕ Agregar habilidad
                      </button>

                      <button className="btn perfil-accion-btn" onClick={handleGuardarHabilidades}>
                        💾 Guardar cambios
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* === INTERCAMBIOS === */}
            {seccionActiva === "intercambios" && (
              <>
                <h2 className="fw-bold mb-4 text-center">Intercambios</h2>

                {/* Ejemplo de fila (ajústalo a tu backend cuando tengas el array) */}
                <div className="tabla-intercambios-container">
                  <table className="tabla-intercambios">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Persona</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#123</td>
                        <td>Clases de guitarra</td>
                        <td>Ana López</td>
                        <td>
                          <button
                            className="btn-finalizado"
                            onClick={() =>
                              abrirModalPuntuacion({
                                id_usuario: 2,
                                nombre: "Ana López",
                              })
                            }
                          >
                            Servicio Finalizado
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ======= Modales / Botón flotante ======= */}

      {/* Botón flotante de mensajería */}
      <BotonMensajeria onClick={() => setMostrarMensajeria(true)} />

      {/* Modal de mensajería */}
      {mostrarMensajeria && <ModalMensajeria onClose={() => setMostrarMensajeria(false)} />}

      {/* Modal de agregar habilidad */}
      {mostrarModalHabilidad && (
        <ModalAgregarHabilidad
          usuario={usuario}
          onClose={() => setMostrarModalHabilidad(false)}
          onSuccess={async () => {
            // Al cerrar OK el modal, refrescamos desde backend y nos quedamos en edición
            await refreshUsuario();
          }}
        />
      )}

      {/* Modal de puntuación (intercambios) */}
      {mostrarModalPuntuacion && (
        <ModalPuntuacion
          mostrar={mostrarModalPuntuacion}
          onClose={() => setMostrarModalPuntuacion(false)}
          usuarioEvaluado={usuarioEvaluado}
          onSubmit={handleEnviarPuntuacion}
        />
      )}

      <Footer />
    </>
  );
}

export default PerfilUsuario;
