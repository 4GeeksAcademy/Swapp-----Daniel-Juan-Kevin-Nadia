import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";
import "../assets/styles/PerfilUsuario.css";
import { env } from "../environ";
import { useStore } from "../hooks/useStore";
import CropperModal from "../assets/components/CropperModal";
import ModalAgregarHabilidad from "../assets/components/ModalAgregarHabilidad";
import BotonMensajeria from "../assets/components/BotonMensajeria";
import ModalMensajeria from "../assets/components/ModalMensajeria";
import ModalPuntuacion from "../assets/components/ModalPuntuacion";
import ModalIntercambio from "../assets/components/ModalIntercambio";

function PerfilUsuario() {
  const { _, dispatch } = useStore();
  const [usuario, setUsuario] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState("datos");

  // Datos personales
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [msg, setMsg] = useState({});

  // Imagen / cropper
  const [imagenTemporal, setImagenTemporal] = useState(null);
  const [mostrarCropper, setMostrarCropper] = useState(false);

  // Habilidades
  const [mostrarModalHabilidad, setMostrarModalHabilidad] = useState(false);
 
  // otros estados habilidades
const [editandoHabilidades, setEditandoHabilidades] = useState(false);


  // Mensajería
  const [mostrarModalMensajes, setMostrarModalMensajes] = useState(false);

  // Puntuación
  const [mostrarModalPuntuacion, setMostrarModalPuntuacion] = useState(false);
  const [usuarioEvaluado, setUsuarioEvaluado] = useState(null);
  
  // Intercambios
  const [intercambios, setIntercambios] = useState([]);
  const [mostrarModalIntercambio, setMostrarModalIntercambio] = useState(false);

  const navigate = useNavigate();

  const yo = usuario;

  // Cargar usuario 
  useEffect(() => {
    const rawToken = localStorage.getItem("token");
    const usuarioToken = rawToken ? rawToken.replace(/^"|"$/g, "") : null;
    const usuarioGoogle = localStorage.getItem("user");

    if (!usuarioToken && !usuarioGoogle) {
      // alert("No hay sesión activa. Por favor inicia sesión.");
      navigate("/login");
      return;
    }

    // Si viene desde Google
    if (usuarioGoogle) {
      const data = JSON.parse(usuarioGoogle);
      setUsuario({
        id_usuario: data.id_usuario,
        nombre: data.nombre,
        apellido: data.apellido,
        correo_electronico: data.correo_electronico,
        foto_perfil: data.foto_perfil,
        fecha_nacimiento: null,
        genero: "",
        descripcion: "",
        habilidades: [],
      });

      setFormData({
        nombre: data.nombre,
        apellido: data.apellido,
        correo_electronico: data.correo_electronico,
        foto_perfil: data.foto_perfil,
        fecha_nacimiento: "",
        genero: "",
        descripcion: "",
      });

      return;
    }

    const fetchUsuario = async () => {
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

    fetchUsuario();
  }, [dispatch, navigate]);

// Cargar los intercambios del usuario una vez que ya esté autenticado
useEffect(() => {
  if (usuario?.id_usuario) obtenerIntercambios();
}, [usuario]);


// helper
const getTokenLimpio = () => {
  const raw = localStorage.getItem("token");
  return raw ? raw.replace(/^"|"$/g, "") : null;
};


  // Handlers de datos personales 
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


//Guardar datos personales usando endpoints de usuarios 
const handleGuardar = async () => {
  try {
    // Validación mínima
    if (!formData.nombre || !formData.apellido || !formData.correo_electronico) {
      setMsg({ tipo: "danger", contenido: "Por favor completa todos los campos obligatorios." });
      return;
    }

    // Construir fecha SOLO si hay día/mes/año
    let fechaFinal = null;
    if (formData.dia && formData.mes && formData.anio) {
      fechaFinal = `${formData.anio}-${String(formData.mes).padStart(2, "0")}-${String(formData.dia).padStart(2, "0")}`;
    }

    // Armar payload sin dia/mes/anio
    const { dia, mes, anio, ...resto } = formData;
    const payload = { ...resto };

    if (fechaFinal) {
      payload.fecha_nacimiento = fechaFinal;
    } else {

      delete payload.fecha_nacimiento;

    }


    const token = getTokenLimpio();

    const resp = await fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("PUT /api/usuarios/:id fallo:", resp.status, errText);
      throw new Error(`Error HTTP ${resp.status}`);
    }

    const data = await resp.json();

    // Actualizar estado
    setUsuario(data?.actualizado ?? usuario);
    dispatch({ type: "SET_USUARIO", payload: data?.actualizado ?? usuario });
    setEditando(false);
    setMsg({ tipo: "success", contenido: data?.msj || "Cambios guardados correctamente." });
  } catch (e) {
    console.error("Error al guardar:", e);
    setMsg({ tipo: "danger", contenido: "No se pudo guardar la información." });
  }
};


  //  Foto de perfil
  const handleEditarFoto = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImagenTemporal(url);
      setMostrarCropper(true);
    };

    input.click();
  };



// ELIMINAR HABILIDAD DEL USUARIO (desasociar)
const handleEliminarHabilidad = async (idHabilidad) => {
  try {
    const res = await fetch(
      `${env.api}/api/usuarios/${usuario.id_usuario}/habilidad`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ desasociar: idHabilidad }),
      }
    );

    if (!res.ok) {
      throw new Error("Error al desasociar habilidad");
    }

    // Refrescar los datos del usuario desde backend
    const ref = await fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`);
    if (!ref.ok) throw new Error("Error al refrescar usuario");
    const data = await ref.json();

    setUsuario(data);
    setMsg({
      tipo: "success",
      contenido: "Habilidad eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error al eliminar habilidad:", error);
    setMsg({
      tipo: "danger",
      contenido: "No se pudo eliminar la habilidad.",
    });
  }
};



//  GUARDAR CAMBIOS 
const handleGuardarCambiosHabilidades = () => {
  setEditandoHabilidades(false);
  setMsg({
    tipo: "success",
    contenido: "Cambios guardados correctamente.",
  });
};


// helpers
const fetchUsuarioById = async (id) => {
  if (!id) return null;
  try {
    const r = await fetch(`${env.api}/api/usuarios/${id}`, {
      headers: { Accept: "application/json" },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
};

// Intercambios - obtener todos del usuario autenticado (resuelve oferta/demanda)
const obtenerIntercambios = async () => {
  try {
    if (!usuario?.id_usuario) return;

    const res = await fetch(
      `${env.api}/api/intercambios/usuario/${usuario.id_usuario}`,
      { headers: { Accept: "application/json" } }
    );
    if (!res.ok) throw new Error("Error al obtener intercambios");

    const raw = await res.json();
    const lista = Array.isArray(raw) ? raw : [];

    // recolectar ids únicos de usuarios para minimizar llamadas
    const ids = new Set();
    for (const it of lista) {
      if (it.id_usuario_oferta) ids.add(it.id_usuario_oferta);
      if (it.id_usuario_demanda) ids.add(it.id_usuario_demanda);
    }

    // fetch en paralelo de usuarios
    const idsArr = Array.from(ids);
    const usuarios = await Promise.all(idsArr.map((id) => fetchUsuarioById(id)));
    const mapaUsuarios = new Map(idsArr.map((id, idx) => [id, usuarios[idx]]));

    const normalizados = lista.map((it) => {
      const oferta = it.id_usuario_oferta ? mapaUsuarios.get(it.id_usuario_oferta) : null;
      const demanda = it.id_usuario_demanda ? mapaUsuarios.get(it.id_usuario_demanda) : null;

      const nombreOferta = oferta
        ? `${oferta.nombre || ""} ${oferta.apellido || ""}`.trim() || `#${it.id_usuario_oferta}`
        : it.id_usuario_oferta ? `#${it.id_usuario_oferta}` : "—";

      const nombreDemanda = demanda
        ? `${demanda.nombre || ""} ${demanda.apellido || ""}`.trim() || `#${it.id_usuario_demanda}`
        : it.id_usuario_demanda ? `#${it.id_usuario_demanda}` : "—";

      return {
        ...it,
        usuario_oferta: oferta,
        usuario_demanda: demanda,
        nombre_oferta: nombreOferta,
        nombre_demanda: nombreDemanda,
      };
    });

    setIntercambios(normalizados);
  } catch (err) {
    console.error("Error al cargar intercambios:", err);
    setIntercambios([]);
  }
};


// seccion intercambios
const handleFinalizarIntercambio = (inter) => {
  setUsuarioEvaluado({
    id_intercambio: inter.id_intercambio,
    nombre:
      inter.usuario_demanda?.nombre ||
      inter.usuario_demandante?.nombre ||
      inter.usuario_oferta?.nombre ||
      "Usuario",
  });
  setMostrarModalPuntuacion(true);
};



// Eliminar un intercambio creado
const handleEliminarIntercambio = async (id_intercambio) => {
  try {
    const res = await fetch(`${env.api}/api/intercambios/${id_intercambio}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Error al eliminar el intercambio");

    // Mostrar mensaje visual en pantalla (sin alertas del navegador)
    setMsg({
      tipo: "success",
      contenido: "✅ Intercambio eliminado correctamente.",
    });

    // Refrescar la lista de intercambios
    obtenerIntercambios();

    // Ocultar el mensaje después de unos segundos
    setTimeout(() => {
      setMsg(null);
    }, 3000);
  } catch (err) {
    console.error("Error eliminando intercambio:", err);
    setMsg({
      tipo: "danger",
      contenido: "❌ No se pudo eliminar el intercambio.",
    });

    setTimeout(() => {
      setMsg(null);
    }, 4000);
  }
};

// finalizar y refrescar
const handleEnviarPuntuacion = async (_payload) => {
  try {
    const token = getTokenLimpio();
    const id = usuarioEvaluado?.id_intercambio;
    if (!id) throw new Error("Falta id_intercambio");

    const r = await fetch(`${env.api}/api/intercambios/${id}/finalizar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!r.ok) {
      const txt = await r.text();
      throw new Error(`Error al finalizar intercambio: ${r.status} ${txt}`);
    }

    await obtenerIntercambios();
    setMsg({ tipo: "success", contenido: "Intercambio finalizado correctamente." });
    setTimeout(() => setMsg(null), 3000);
  } catch (err) {
    console.error(err);
    setMsg({ tipo: "danger", contenido: "No se pudo finalizar el intercambio." });
    setTimeout(() => setMsg(null), 3000);
  } finally {
    setMostrarModalPuntuacion(false);
  }
};


const abrirModalPuntuacion = (inter) => {
  setUsuarioEvaluado({
    id_intercambio: inter.id_intercambio,
    nombre:
      inter.usuario_demandante?.nombre ||
      inter.usuario_oferta?.nombre ||
      "Usuario",
  });
  setMostrarModalPuntuacion(true);
};




  if (!usuario) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <>
      <Navbar />

      <div className="container-fluid perfil-container py-5">
        <div className="row justify-content-center">
          {/* Sidebar */}
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
                className={`list-group-item ${seccionActiva === "habilidades" ? "active" : ""}`}
                onClick={() => {
                  setSeccionActiva("habilidades");
                  // refresca para traer descripciones actualizadas desde backend
                  fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`)
                    .then((r) => r.json())
                    .then((d) => setUsuario(d))
                    .catch((e) => console.error("Error refrescando usuario:", e));
                }}
              >
                Habilidades
              </button>

              <div className="perfil-divider"></div>

              <button
                className={`list-group-item ${seccionActiva === "intercambios" ? "active" : ""}`}
                onClick={() => setSeccionActiva("intercambios")}
              >
                Intercambios
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="col-12 col-md-8 perfil-content p-4">
            {seccionActiva === "datos" ? (
              <>
                <h2 className="text-dark fw-bold mb-4 text-center">Datos Personales</h2>

                <form className="row g-3">
                  {/* Nombre */}
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

                  {/* Apellido */}
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

                  {/* Correo */}
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

                  {/* Fecha nacimiento con Día/Mes/Año */}
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

                        {/* Mes */}
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

                  {/* Género */}
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
                      <input
                        type="text"
                        className="form-control"
                        value={usuario.genero}
                        disabled
                      />
                    )}
                  </div>

                  {/* Descripción usuario */}
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

                  {/* Mensaje */}
                  {Object.keys(msg).length > 0 && (
                    <div className={`alert alert-${msg.tipo}`} role="alert">
                      {msg.contenido}
                    </div>
                  )}

                  {/* Botón guardar/editar */}
                  <div className="col-12 text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-lg perfil-accion-btn"
                      onClick={editando ? handleGuardar : () => setEditando(true)}
                    >
                      {editando ? "Guardar Cambios" : "Editar Información"}
                    </button>
                  </div>
                </form>
              </>
              ) : seccionActiva === "habilidades" ? (
                <>
                  <h2 className="fw-bold mb-4 text-center">Habilidades</h2>

                    <div className="habilidades-contenedor">
                      {usuario.habilidades && usuario.habilidades.length > 0 ? (
                        usuario.habilidades.map((hab, index) => (
                          <div key={index} className="habilidad-card">
                            <div className="d-flex justify-content-between align-items-center">
                              <h5 className="m-0" style={{ color: "var(--naranja)" }}>
                                {hab.nombre_habilidad}
                              </h5>
                              {editandoHabilidades && (
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleEliminarHabilidad(hab.id_habilidad)}
                                >
                                  ✖
                                </button>
                              )}
                            </div>
                            <p className="text-muted mt-2 mb-0">
                              {hab.descripcion && hab.descripcion.trim() !== ""
                                ? hab.descripcion
                                : "Sin descripción"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted text-center">
                          Aún no has agregado habilidades.
                        </p>
                      )}
                    </div>

                    {/* Alerta debajo del listado y arriba de los botones */}
                    {msg && msg.tipo && (
                      <div className={`alert alert-${msg.tipo} text-center mt-3`} role="alert">
                        {msg.contenido}
                      </div>
                    )}

                    <div className="d-flex justify-content-center gap-3 mt-4 flex-wrap">
                      {!editandoHabilidades ? (
                        <button className="btn-naranja" onClick={() => setEditandoHabilidades(true)}>
                          ✏️ Editar habilidades
                        </button>
                      ) : (
                        <>
                          <button className="btn-agregar" onClick={() => setMostrarModalHabilidad(true)}>
                            ➕ Agregar habilidad
                          </button>

                          <button className="btn-naranja" onClick={handleGuardarCambiosHabilidades}>
                            💾 Guardar cambios
                          </button>

                          <button className="btn-oscuro" onClick={() => setEditandoHabilidades(false)}>
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>


                  {mostrarModalHabilidad && (
                    <ModalAgregarHabilidad
                      usuario={usuario}
                      onClose={() => setMostrarModalHabilidad(false)}
                      onSuccess={() => {
                        setMostrarModalHabilidad(false);
                        // refresca usuario para ver la nueva habilidad
                        fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`)
                          .then((r) => r.json())
                          .then((d) => setUsuario(d))
                          .catch((e) => console.error("Error al actualizar habilidades:", e));
                      }}
                    />
                  )}
                </>
              ) : (

                // Sección Intercambios
                <div className="seccion-intercambios">
                  <h2 className="fw-bold mb-4 text-center">Intercambios</h2>

                  <div className="text-center mb-4">
                    <button
                      className="btn-naranja"
                      onClick={() => setMostrarModalIntercambio(true)}
                    >
                      Crear nuevo intercambio
                    </button>
                  </div>

                  <div className="tabla-intercambios-container">
                    <table className="tabla-intercambios">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Habilidad</th>
                          <th>Usuario oferta</th>
                          <th>Usuario demanda</th>
                          <th>Estado</th>
                          <th>Acción</th>
                        </tr>
                      </thead>

                      <tbody>
                        {intercambios.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center text-muted">
                              No tienes intercambios registrados.
                            </td>
                          </tr>
                        ) : (
                          intercambios.map((inter) => {
                              const estaFinalizado = inter.intercambio_finalizado === true;
                              const esDemandante =
                                inter.usuario_demanda?.id_usuario === yo?.id_usuario ||
                                inter.id_usuario_demanda === yo?.id_usuario;

                            return (
                              <tr key={inter.id_intercambio}>
                                <td>#{inter.id_intercambio}</td>
                                <td>{inter.habilidad?.nombre_habilidad || "—"}</td>
                                <td>{inter.nombre_oferta || "—"}</td>
                                <td>{inter.nombre_demanda || "—"}</td>
                                <td>{estaFinalizado ? "Finalizado" : "Activo"}</td>

                                <td className="d-flex gap-2 justify-content-center flex-wrap">
                                  {estaFinalizado ? (
                                    <span className="text-success fw-semibold">
                                      Intercambio finalizado
                                    </span>
                                  ) : (
                                    <>
                                      {/* Solo el demandante puede finalizar */}
                                      {esDemandante && (
                                        <button
                                          className="btn btn-oscuro btn-sm"
                                          onClick={() => handleFinalizarIntercambio(inter)}
                                        >
                                          Finalizar
                                        </button>
                                      )}

                                      {/* Todos pueden eliminar */}
                                      <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => handleEliminarIntercambio(inter.id_intercambio)}
                                      >
                                        Eliminar
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>



            )}
          </div>
        </div>
      </div>

      {/* Modales */}

      {/* Cropper */}
      {mostrarCropper && (
        <CropperModal
          image={imagenTemporal}
          onClose={() => setMostrarCropper(false)}
          onCropDone={async (croppedBase64) => {
            setMostrarCropper(false);
            const blob = await (await fetch(croppedBase64)).blob();
            const formData = new FormData();
            formData.append("imagen", blob, "recorte.jpg");

            try {
              const userData = JSON.parse(localStorage.getItem("user"));
              const userId = userData?.id_usuario || usuario?.id_usuario;

              const res = await fetch(`${env.api}/api/usuarios/${userId}/foto-perfil`, {
                method: "POST",
                body: formData,
              });

              const data = await res.json();
              if (res.ok) {
                setUsuario((prev) => ({
                  ...prev,
                  foto_perfil: data.foto_perfil,
                }));
                const img = document.querySelector(".perfil-avatar");
                if (img) img.src = data.foto_perfil;
                setMsg({
                  tipo: "success",
                  contenido: "Foto actualizada correctamente",
                });
              } else {
                throw new Error(data.error || "Error al subir la foto");
              }
            } catch (err) {
              console.error(err);
              setMsg({
                tipo: "danger",
                contenido: "No se pudo subir la imagen recortada",
              });
            }
          }}
        />
      )}

      {/* Puntuación */}
      {mostrarModalPuntuacion && (
        <ModalPuntuacion
          mostrar={mostrarModalPuntuacion}
          onClose={() => setMostrarModalPuntuacion(false)}
          usuarioEvaluado={usuarioEvaluado}
          onSubmit={handleEnviarPuntuacion}
        />
      )}



      {/* Botón flotante + Mensajería */}
      <BotonMensajeria onClick={() => setMostrarModalMensajes(true)} />
      {mostrarModalMensajes && (
        <ModalMensajeria
          mostrar={mostrarModalMensajes}
          cerrar={() => setMostrarModalMensajes(false)}
        />
      )}
      

      {mostrarModalIntercambio && (
      <ModalIntercambio
        mostrar={mostrarModalIntercambio}
        cerrar={() => {
          setMostrarModalIntercambio(false);
          obtenerIntercambios(); // refrescar lista al cerrar
        }}
      />
    )}

      <Footer />
    </>
  );
}

export default PerfilUsuario;
