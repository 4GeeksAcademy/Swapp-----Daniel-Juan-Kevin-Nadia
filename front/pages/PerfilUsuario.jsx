import React, { useState, useEffect } from "react";
import { data, useNavigate } from "react-router";
import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";
import "../assets/styles/PerfilUsuario.css";
import { env } from "../environ";
import { useStore } from "../hooks/useStore";

function PerfilUsuario() {
  const { _, dispatch } = useStore();
  const [usuario, setUsuario] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState("datos");
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const [idCategorie, setIdCategorie] = useState(0);
  const [habilidades, setHabilidades] = useState([]);
  const [idHabilidad, setIdHabilidad] = useState(0);
  const [editandoHabilidades, setEditandoHabilidades] = useState(false);
  const [msg, setMsg] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const rawToken = localStorage.getItem("token");
    const usuarioToken = rawToken ? rawToken.replace(/^"|"$/g, "") : null;

    if (!usuarioToken) {
      alert(" No hay sesión activa. Por favor inicia sesión.");
      navigate("/login");
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
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCategorieChange = (e) => {
    let idxCategory = parseInt(e.target.value);
    setIdCategorie(idxCategory);
    let categ = categories.find((c) => c.id_categoria === idxCategory);

    if (categ) setHabilidades(categ["habilidades"]);
  };

  const handleGuardar = async () => {
    try {
      if (
        !formData.nombre ||
        !formData.apellido ||
        !formData.correo_electronico
      ) {
        alert("Por favor completa todos los campos obligatorios.");
        return;
      }

      let fechaFinal = formData.fecha_nacimiento;
      if (formData.dia && formData.mes && formData.anio) {
        if (!formData.dia || !formData.mes || !formData.anio) {
          alert("Por favor selecciona día, mes y año.");
          return;
        }

        fechaFinal = `${formData.anio}-${String(formData.mes).padStart(
          2,
          "0"
        )}-${String(formData.dia).padStart(2, "0")}`;
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

      const dataActualizada = await response.json();
      setUsuario(dataActualizada?.actualizado);
      dispatch({type: "SET_USUARIO", payload: dataActualizada?.actualizado});
      setEditando(false);
      setMsg({tipo:"success", contenido: dataActualizada.msj});
    } catch (error) {
      console.error("Error al guardar:", error);
      setMsg({tipo:"danger", contenido: "No se pudo guardar la información"});
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
      setMsg({tipo:"success", contenido: "Foto actualizada correctamente"});
    } catch (error) {
      console.error("Error al actualizar foto:", error);
      setMsg({tipo:"danger", contenido: "No se pudo actualizar la foto"});
    }
  };

  const handleAgregarHabilidad = () => {
    if (idHabilidad > 0) {
      fetch(`${env.api}/api/usuarios/${usuario.id_usuario}/habilidad`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          asociar: idHabilidad,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error en la petición: " + response.status);
          }
          return response.json();
        })
        .then((data) => setUsuario(data))
        .catch((error) => {
          console.error("Hubo un problema con la petición:", error);
        });
      setEditandoHabilidades(false);
    }
  };

  if (!usuario) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <>
      <Navbar />
      <div className="container-fluid perfil-container py-5">
        <div className="row justify-content-center">
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

              <button
                className="btn btn-editar-foto mb-2"
                onClick={handleEditarFoto}
              >
                📷 Editar Foto
              </button>
              <h4 className="perfil-nombre mb-4">
                {usuario.nombre} {usuario.apellido}
              </h4>
            </div>

            <div className="perfil-secciones mt-4">
              <button
                className={`list-group-item ${
                  seccionActiva === "datos" ? "active" : ""
                }`}
                onClick={() => setSeccionActiva("datos")}
              >
                Datos Personales
              </button>
              <div className="perfil-divider"></div>
              <button
                className={`list-group-item ${
                  seccionActiva === "habilidades" ? "active" : ""
                }`}
                onClick={() => {
                  setSeccionActiva("habilidades");
                  fetch(`${env.api}/api/usuarios/${usuario.id_usuario}`)
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(
                          "Error en la petición: " + response.status
                        );
                      }
                      return response.json();
                    })
                    .then((data) => setUsuario(data))
                    .catch((error) => {
                      console.error("Hubo un problema con la petición:", error);
                    });
                }}
              >
                Habilidades
              </button>
            </div>
          </div>

          <div className="col-12 col-md-8 perfil-content p-4">
            {seccionActiva === "datos" ? (
              <>
                <h2 className="text-dark fw-bold mb-4 text-center">
                  Datos Personales
                </h2>

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

                  <div className="col-md-6">
                    <label className="form-label">Fecha de nacimiento</label>
                    {editando ? (
                      <div className="d-flex" style={{ gap: "10px" }}>
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
                      <input
                        type="text"
                        className="form-control"
                        value={usuario.genero}
                        disabled
                      />
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
                  
                  { Object.keys(msg).length > 0 ? (
                      <div className={`alert alert-${msg?.tipo}`} role="alert">{msg?.contenido}</div>
                    ) : ""
                  }

                  <div className="col-12 text-center mt-4">
                    <button
                      type="button"
                      className="btn btn-lg perfil-accion-btn"
                      onClick={
                        editando ? handleGuardar : () => setEditando(true)
                      }
                    >
                      {editando ? "Guardar Cambios" : "Editar Información"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="fw-bold mb-4 text-center">Habilidades</h2>
                {!editandoHabilidades ? (
                  <>
                    {usuario.habilidades && usuario.habilidades.length > 0 ? (
                      <ul className="habilidades-lista">
                        {usuario.habilidades.map((hab, index) => (
                          <li key={index}>
                            <strong>{hab.nombre_habilidad}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">
                        Aún no has agregado habilidades.
                      </p>
                    )}
                    <button
                      className="btn perfil-accion-btn mt-3"
                      onClick={() => {
                        setEditandoHabilidades(true);
                        fetch(`${env.api}/api/categorias`)
                          .then((response) => {
                            if (!response.ok) {
                              throw new Error(
                                "Error en la petición: " + response.status
                              );
                            }
                            return response.json();
                          })
                          .then((data) => setCategories(data))
                          .catch((error) => {
                            console.error(
                              "Hubo un problema con la petición:",
                              error
                            );
                          });
                      }}
                    >
                      ✏️ Editar habilidades
                    </button>
                  </>
                ) : (
                  <>
                    <div className="mb-3 text-start">
                      <div className="input-group my-2">
                        <label>Categorías</label>
                        <select
                          className="form-select mt-1"
                          name="id_categoria"
                          onChange={handleCategorieChange}
                          value={idCategorie}
                        >
                          {categories.map((category) => (
                            <option
                              key={category.id_categoria}
                              value={category.id_categoria}
                            >
                              {category.nombre_categoria}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group my-2">
                        <div className="input-group-prepend">
                          <label htmlFor="inputGroupSelect01">
                            Habilidades
                          </label>
                        </div>
                        <select
                          className="form-select mt-1"
                          name="id_habilidad"
                          onChange={(e) =>
                            setIdHabilidad(parseInt(e.target.value))
                          }
                          value={idHabilidad}
                        >
                          {habilidades &&
                            habilidades.map((habilidad, id) => (
                              <option
                                key={`id_habilidad-${id}`}
                                value={habilidad?.id_habilidad}
                              >
                                {habilidad?.nombre_habilidad}
                              </option>
                            ))}
                        </select>
                      </div>

                      <button
                        className="btn btn-editar-foto"
                        onClick={handleAgregarHabilidad}
                      >
                        ➕ Agregar habilidad
                      </button>
                    </div>

                    {usuario.habilidades && usuario.habilidades.length > 0 && (
                      <ul className="habilidades-lista mt-3">
                        {usuario.habilidades.map((hab, index) => (
                          <li key={index}>
                            <strong>{hab.nombre_habilidad}</strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PerfilUsuario;
