import React, { useState, useEffect } from "react";
import "../styles/ModalAgregarHabilidad.css";
import { env } from "../../environ";

const ModalAgregarHabilidad = ({ usuario, onClose, onSuccess }) => {
  const [categorias, setCategorias] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [idCategoria, setIdCategoria] = useState("");
  const [idHabilidad, setIdHabilidad] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Cargar categorías al abrir el modal
  useEffect(() => {
    fetch(`${env.api}/api/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  // Actualiza la lista de habilidades al seleccionar categoría
  const handleCategoriaChange = (e) => {
    const id = parseInt(e.target.value);
    setIdCategoria(id);
    const categoria = categorias.find((c) => c.id_categoria === id);
    if (categoria) {
      setHabilidades(categoria.habilidades);
    } else {
      setHabilidades([]);
    }
    setIdHabilidad("");
  };

  // Agregar habilidad al usuario
  const handleAgregar = async () => {
    if (!idHabilidad) {
      setMensaje({ tipo: "error", texto: "Selecciona una habilidad" });
      return;
    }

    setCargando(true);
    try {
      const body = { asociar: idHabilidad };

      const response = await fetch(
        `${env.api}/api/usuarios/${usuario.id_usuario}/habilidad`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMensaje({
          tipo: "success",
          texto: "✅ Habilidad agregada correctamente",
        });
        setTimeout(() => {
          onSuccess && onSuccess();
          onClose();
        }, 1200);
      } else {
        setMensaje({
          tipo: "error",
          texto: data.msj || "No se pudo agregar la habilidad",
        });
      }
    } catch (error) {
      console.error("Error al agregar habilidad:", error);
      setMensaje({
        tipo: "error",
        texto: "❌ Error en la conexión con el servidor",
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-agregar-habilidad animate-fadeIn">
        <h3 className="text-center fw-bold mb-3">Agregar Habilidad</h3>

        {/* Selección de Categoría */}
        <label className="form-label mt-2">Categoría</label>
        <select
          className="form-select"
          value={idCategoria}
          onChange={handleCategoriaChange}
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre_categoria}
            </option>
          ))}
        </select>

        {/* Selección de Habilidad */}
        <label className="form-label mt-3">Habilidad</label>
        <select
          className="form-select"
          value={idHabilidad}
          onChange={(e) => setIdHabilidad(parseInt(e.target.value))}
        >
          <option value="">Selecciona una habilidad</option>
          {habilidades.map((hab) => (
            <option key={hab.id_habilidad} value={hab.id_habilidad}>
              {hab.nombre_habilidad}
            </option>
          ))}
        </select>

        {/* Mensajes */}
        {mensaje && (
          <div
            className={`alert mt-3 ${
              mensaje.tipo === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* Botones */}
        <div className="modal-buttons mt-4 d-flex justify-content-between">
          <button className="btn-oscuro" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn-naranja"
            onClick={handleAgregar}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAgregarHabilidad;
