import React, { useEffect, useState } from "react";
import "../styles/ModalIntercambio.css";
import { env } from "../../environ";

export default function ModalIntercambio({ mostrar, cerrar }) {
  const [yo, setYo] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [idCategoria, setIdCategoria] = useState("");
  const [idHabilidad, setIdHabilidad] = useState("");
  const [msg, setMsg] = useState(null);
  const [enviando, setEnviando] = useState(false);

  // === Helper para limpiar token ===
  const getTokenLimpio = () => {
    const raw = localStorage.getItem("token");
    return raw ? raw.replace(/^"|"$/g, "") : null;
  };

  // === Cargar usuario autenticado ===
  useEffect(() => {
    if (!mostrar) return;
    const token = getTokenLimpio();
    if (!token) return;

    fetch(`${env.api}/api/autorizacion`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setYo)
      .catch((e) => console.error("Error al cargar usuario actual:", e));
  }, [mostrar]);

  // === Cargar categorías ===
  useEffect(() => {
    if (!mostrar) return;
    fetch(`${env.api}/api/categorias`, { headers: { Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setCategorias(data || []))
      .catch((e) => console.error("Error cargando categorías:", e));
  }, [mostrar]);

  // === Manejar selección de categoría ===
  const handleCategoriaChange = (e) => {
    const id = parseInt(e.target.value);
    setIdCategoria(id);
    const categoria = categorias.find((c) => c.id_categoria === id);
    if (categoria) {
      setHabilidades(categoria.habilidades || []);
    } else {
      setHabilidades([]);
    }
    setIdHabilidad("");
  };

  // === Cancelar o cerrar el modal ===
  const handleCerrar = () => {
    setMsg(null);
    setIdCategoria("");
    setIdHabilidad("");
    cerrar();
  };

  // === Crear nuevo intercambio ===
  const handleEnviar = async () => {
    if (!yo?.id_usuario) {
      setMsg({ tipo: "danger", contenido: "⚠️ No hay sesión activa." });
      return;
    }
    if (!idHabilidad) {
      setMsg({ tipo: "danger", contenido: "⚠️ Selecciona una habilidad." });
      return;
    }

    setEnviando(true);
    try {
      const body = {
        id_usuario_postulante: yo.id_usuario,
        id_habilidad: idHabilidad,
      };

      const res = await fetch(`${env.api}/api/intercambios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al crear el intercambio");
      await res.json();

      setMsg({
        tipo: "success",
        contenido: "✅ Intercambio creado correctamente.",
      });

      setTimeout(() => handleCerrar(), 1500);
    } catch (error) {
      console.error("Error al crear intercambio:", error);
      setMsg({
        tipo: "danger",
        contenido: "❌ No se pudo crear el intercambio.",
      });
    } finally {
      setEnviando(false);
    }
  };

  if (!mostrar) return null;

  return (
    <div
      className="modal fade show d-block fondo-modal"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* === HEADER === */}
          <div className="modal-header bg-naranja text-white">
            <h5 className="modal-title">Crear nuevo intercambio</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCerrar}
            />
          </div>

          {/* === BODY === */}
          <div className="modal-body">
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

            <label className="form-label mt-3">Habilidad</label>
            <select
              className="form-select"
              value={idHabilidad}
              onChange={(e) => setIdHabilidad(parseInt(e.target.value))}
              disabled={!idCategoria}
            >
              <option value="">Selecciona una habilidad</option>
              {habilidades.map((hab) => (
                <option key={hab.id_habilidad} value={hab.id_habilidad}>
                  {hab.nombre_habilidad}
                </option>
              ))}
            </select>

            {msg && (
              <div className={`alert mt-3 alert-${msg.tipo}`} role="alert">
                {msg.contenido}
              </div>
            )}
          </div>

          {/* === FOOTER === */}
          <div className="modal-footer d-flex justify-content-center">
            <button
              className="btn btn-outline-dark"
              onClick={handleCerrar}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              className="btn btn-naranja"
              onClick={handleEnviar}
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Crear intercambio"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
