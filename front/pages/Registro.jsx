import "../assets/styles/Registro.css";
import React, { useState } from "react";

function Registro() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dia: "",
    mes: "",
    anio: "",
    genero: "",
    habilidad: "",
    descripcion: "",
    email: "",
    contrasena: "",
    aceptaTerminos: false,
  });
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === "checkbox" ? checked : value;

    console.log("Campo:", name, "Valor:", newValue);

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        <div className="col-6">
          <div className="d-flex justify-content-center align-items-center">
            <img className="logo-registro" src="logo swapp.webp"></img>
          </div>

          <form className="text-start">
            <h5 className="text-start my-3">Únete a Swapp!</h5>
            <div className="d-flex gap-2">
              <input
                onChange={handleChange}
                value={formData.nombre}
                type="text"
                className="form-control"
                id="nombre"
                aria-describedby="emailHelp"
                placeholder="Nombre"
              />

              <input
                onChange={handleChange}
                value={formData.apellidos}
                type="text"
                className="form-control flex-grow-1"
                id="apellidos"
                aria-describedby=""
                placeholder="Apellidos"
              />
            </div>
            <div className="">
              <label htmlFor="fecha-nacimiento" className="form-label">
                Fecha de nacimiento
              </label>
              <div className="d-flex" style={{ gap: "12px" }}>
                <select
                  className="form-select"
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
                  className="form-select"
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
                  className="form-select"
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

            <div className="mt-2">
              <label className="form-label">Género</label>
              <div className="d-flex justify-content-center align-items-center">
                <div className="input-group ">
                  <div className="input-group-prepend ">
                    <div className=" mujer-radio">
                      <input
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

              <div className="input-group my-3">
                <div className="input-group-prepend">
                  <label htmlFor="inputGroupSelect01">Habilidades</label>
                </div>
                <select
                  className="form-select"
                  style={{ width: "100%" }}
                  name="habilidad"
                  onChange={handleChange}
                  value={formData.habilidad}
                  id="inputGroupSelect01"
                >
                  <option value="">Elige tu habilidad...</option>
                  <option value="dibujo">Dibujo y pintura</option>
                  <option value="tecnologia">Tecnología y Programación</option>
                  <option value="educacion"> Educación y Tutorías</option>
                  <option value="musica">Música y Audio</option>
                  <option value="deporte">Deporte y Bienestar</option>
                  <option value="moda">Moda, Belleza y Cuidado Personal</option>
                  <option value="hogar">Hogar y Reparaciones</option>
                  <option value="mascotas">Mascotas y Animales</option>
                  <option value="negocios">Negocios y Finanzas</option>
                  <option value="entretenimiento">
                    Entretenimiento y Cultura
                  </option>
                  <option value="viajes">Viajes y Estilo de Vida</option>
                  <option value="comunicacion">Comunicación y Marketing</option>
                  <option value="desarrollo">
                    Desarrollo Personal y Coaching
                  </option>
                  <option value="otros">Otros / Misceláneos</option>
                </select>
              </div>
              <div className="">
                <textarea
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  onChange={handleChange}
                  value={formData.descripcion}
                  rows="4"
                  placeholder="Escribe una breve descripción..."
                ></textarea>
              </div>
            </div>

            <div className="form-group mt-3">
              <input
                onChange={handleChange}
                value={formData.email}
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Correo electrónico"
              />
            </div>
            <div className="form-group">
              <input
                onChange={handleChange}
                value={formData.contrasena}
                type="password"
                className="form-control"
                id="contrasena"
                placeholder="Contraseña"
              />
            </div>
            <div className="form-group form-check">
              <input
                onChange={handleChange}
                name="aceptaTerminos"
                checked={formData.aceptaTerminos}
                type="checkbox"
                className="form-check-input"
                id="aceptaTerminos"
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                He leído y acepto las condiciones de uso y política de
                privacidad de Swapp.
              </label>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-main1 mt-3">
                Registrate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Registro;
