import "../assets/styles/Registro.css";
import React, { useState, useEffect } from "react";
import { registrarUsuario } from "../services/api";
import { Link, useNavigate } from "react-router";
import { env } from "../environ";

function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dia: "",
    mes: "",
    anio: "",
    genero: "",
    id_categoria: "",
    id_habilidad: "",
    descripcion: "",
    correo_electronico: "",
    contrasena: "",
    acepta_terminos: false,
  });
  const [categorias, setCategorias] = useState([
    { id_categoria: 0, nombre_categoria: "Elige tu Habilidad..." },
  ]);
  const [habilidades, setHabilidades] = useState([
    { id_habilidad: 0, nombre_habilidad: "Elige tu Habilidad..." },
  ]);
  const [showAlerta, setShowAlerta] = useState(false);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${env.api}/api/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(data));
  }, []);

  useEffect(() => {
    if (formData.id_categoria) {
      fetch(`${env.api}/api/habilidades/categoria/${formData.id_categoria}`)
        .then((res) => res.json())
        .then((data) => setHabilidades(data));
    } else {
      setHabilidades([]);
    }
  }, [formData.id_categoria]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    if (formData.dia && formData.mes && formData.anio) {
      setFormData({
        ...formData,
        fecha_nacimiento: `${formData.anio}-${formData.mes}-${formData.dia}`,
      });
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "id_categoria") {
      setFormData((prev) => ({
        ...prev,
        id_categoria: newValue,
        id_habilidad: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.nombre)) {
      newErrors.nombre = "El nombre sólo puede contener letras";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "Los apellidos son obligatorios";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.apellido)) {
      newErrors.apellido = "Los apellidos sólo pueden contener letras";
    }

    if (!formData.correo_electronico.trim()) {
      newErrors.correo_electronico = "El correo es obligatorio";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo_electronico)
    ) {
      newErrors.correo_electronico = "El correo no es válido";
    }

    if (!formData.contrasena.trim()) {
      newErrors.contrasena = "La contraseña es obligatoria";
    } else if (formData.contrasena.length < 8) {
      newErrors.contrasena = "Debe tener al menos 8 carácteres";
    }

    if (!formData.acepta_terminos) {
      setShowAlerta(true);
      newErrors.acepta_terminos = "Debes aceptar las condiciones de uso.";
    } else {
      setShowAlerta(false);
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const data = await registrarUsuario(formData);

      if (data) {
        setShowModal(true);
      }
    } catch (error) {
      alert("Hubo un error al registrar!");
    }
  };

  return (
    <div className="container">
      <div className="row d-flex flex-column flex-lg-row justify-content-center">
        <div className="col-12 col-lg-5 header-responsive d-flex flex-column justify-content-center align-items-center mb-5">
          <Link
            className="logo-registro-container d-flex justify-content-start"
            to="/"
          >
            <img className="logo-registro" src="swapp sin fondo.webp"></img>
          </Link>
          <h4 className="fw-medium">¡Donde todo, tiene otro valor!</h4>
        </div>
        <div className="col-12 col-lg-7 px-2 form-container d-flex justify-content-center  align-items-center">
          <form className="text-start" onSubmit={handleSubmit}>
            <h5 className="form-title text-start fw-bold my-3">
              Únete a Swapp!
            </h5>
            <div className="d-flex gap-2">
              <div>
                <input
                  name="nombre"
                  onChange={handleChange}
                  value={formData.nombre}
                  type="text"
                  className="form-control registro-input"
                  id="nombre"
                  aria-describedby="emailHelp"
                  placeholder="Nombre"
                />
                {errors.nombre && <p className="error">{errors.nombre}</p>}
              </div>
              <div>
                <input
                  name="apellido"
                  onChange={handleChange}
                  value={formData.apellido}
                  type="text"
                  className="form-control registro-input flex-grow-1"
                  id="apellido"
                  aria-describedby=""
                  placeholder="Apellidos"
                />
                {errors.apellido && <p className="error">{errors.apellido}</p>}
              </div>
            </div>

            <div className="mt-1">
              <label htmlFor="fecha-nacimiento" className="form-label">
                Fecha de nacimiento
              </label>
              <div className="d-flex" style={{ gap: "12px" }}>
                <select
                  className="form-select registro-input"
                  style={{ width: "80px" }}
                  onChange={handleChange}
                  value={formData.dia}
                  id="dia"
                  name="dia"
                >
                  <option value="">Día</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select registro-input"
                  style={{ width: "90px" }}
                  onChange={handleChange}
                  value={formData.mes}
                  id="mes"
                  name="mes"
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
                  className="form-select registro-input"
                  style={{ width: "90px" }}
                  onChange={handleChange}
                  value={formData.anio}
                  id="anio"
                  name="anio"
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
            </div>

            <div className="  mt-1">
              <label className="form-label">Género</label>
              <div className="d-flex justify-content-center align-items-center">
                <div className="input-group ">
                  <div className="input-group-prepend ">
                    <div className=" mujer-radio">
                      <input
                        className="form-check-input"
                        onChange={handleChange}
                        checked={formData.genero === "mujer"}
                        value="mujer"
                        type="radio"
                        id="mujer"
                        name="genero"
                        aria-label="Radio button for following text input"
                      />
                      <label className="label-mujer" htmlFor="mujer">
                        Mujer
                      </label>
                    </div>
                  </div>
                </div>
                <div className="input-group ">
                  <div className="input-group-prepend ">
                    <div className="hombre-radio">
                      <input
                        className="form-check-input"
                        onChange={handleChange}
                        checked={formData.genero === "hombre"}
                        type="radio"
                        id="hombre"
                        name="genero"
                        value="hombre"
                        aria-label="Radio button for following text input"
                      />
                      <label className="label-hombre" htmlFor="mujer">
                        Hombre
                      </label>
                    </div>
                  </div>
                </div>
                <div className="input-group ">
                  <div className="input-group-prepend ">
                    <div className="personalizado-radio">
                      <input
                        className="form-check-input"
                        onChange={handleChange}
                        checked={formData.genero === "personalizado"}
                        type="radio"
                        id="personalizado"
                        name="genero"
                        value="personalizado"
                        aria-label="Radio button following text input"
                      />
                      <label className="label-personalizado" htmlFor="mujer">
                        Personalizado
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="input-group my-2">
                <div className="input-group-prepend">
                  <label htmlFor="inputGroupSelect01">Categorías</label>
                </div>
                <select
                  className="form-select registro-input mt-1"
                  style={{ width: "100%" }}
                  name="id_categoria"
                  onChange={handleChange}
                  value={formData.id_categoria}
                  id="selectCategoria"
                >
                  {categorias &&
                    categorias.map((category, id) => (
                      <option
                        key={category.id_categoria}
                        value={category?.id_categoria}
                      >
                        {category?.nombre_categoria}
                      </option>
                    ))}
                </select>
              </div>

              <div className="input-group my-2">
                <div className="input-group-prepend">
                  <label htmlFor="inputGroupSelect01">Habilidades</label>
                </div>
                <select
                  className="form-select registro-input mt-1"
                  style={{ width: "100%" }}
                  name="id_habilidad"
                  onChange={handleChange}
                  value={formData.id_habilidad}
                  id="selectHabilidad"
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
              <div className=" mt-1">
                <textarea
                  className="form-control registro-input "
                  id="descripcion"
                  name="descripcion"
                  onChange={handleChange}
                  value={formData.descripcion}
                  rows="4"
                  placeholder="Escribe una breve descripción..."
                ></textarea>
              </div>
            </div>

            <div className="form-group mt-2">
              <input
                name="correo_electronico"
                onChange={handleChange}
                value={formData.correo_electronico}
                type="email"
                className="form-control registro-input"
                id="correo_electronico"
                aria-describedby="emailHelp"
                placeholder="Correo electrónico"
              />

              {errors.correo_electronico && (
                <p className="error">{errors.correo_electronico}</p>
              )}
            </div>
            <div className="form-group mt-2">
              <input
                name="contrasena"
                onChange={handleChange}
                value={formData.contrasena}
                type="password"
                className="form-control registro-input
                "
                id="contrasena"
                placeholder="Contraseña"
              />
              {errors.contrasena && (
                <p className="error">{errors.contrasena}</p>
              )}
            </div>
            <div className="form-group form-check mt-2">
              <input
                onChange={handleChange}
                name="acepta_terminos"
                checked={formData.acepta_terminos}
                type="checkbox"
                className="form-check-input"
                id="acepta_terminos"
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                He leído y acepto las condiciones de uso y política de
                privacidad de Swapp.
              </label>
            </div>
            {showAlerta && (
              <div className="alert alert-danger mt-2 p-1" role="alert">
                Debes aceptar las condiciones de uso para registrarte.
              </div>
            )}
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-main1 my-3">
                Registrate
              </button>
            </div>
          </form>
          {showModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content p-3 text-center">
                  <div className="modal-header border-0">
                    <h5 className="modal-title w-100 fw-bold">
                      ¡Te has registrado correctamente! 🎉
                    </h5>
                  </div>
                  <div className="modal-body">
                    <p>¡Bienvenido a nuestra comunidad!</p>
                    <p>¿Qué deseas hacer ahora?</p>
                  </div>
                  <div className="modal-footer border-0 d-flex justify-content-center gap-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowModal(false);
                        setFormData({
                          nombre: "",
                          apellido: "",
                          dia: "",
                          mes: "",
                          anio: "",
                          fecha_nacimiento: "",
                          genero: "",
                          id_categoria: "",
                          id_habilidad: "",
                          descripcion: "",
                          correo_electronico: "",
                          contrasena: "",
                          acepta_terminos: false,
                        });
                      }}
                    >
                      Cerrar
                    </button>

                    <button
                      className="btn btn-main1"
                      onClick={() => navigate("/login")}
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Registro;
