import React, { useEffect, useState } from "react";
import "../styles/ModalIntercambio.css";
import { env } from "../../environ";

export default function ModalIntercambio({ mostrar, cerrar, receptor }) {
  const [yo, setYo] = useState(null); // usuario logueado
  const [habilidades, setHabilidades] = useState([]); // habilidades del receptor
  const [habilidadSeleccionada, setHabilidadSeleccionada] = useState(null);
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

  // === Cargar habilidades del usuario del perfil público (receptor) ===
  useEffect(() => {
    if (!receptor?.id_usuario) return;
    fetch(`${env.api}/api/usuarios/${receptor.id_usuario}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setHabilidades(data.habilidades || []))
      .catch((e) => console.error("Error cargando habilidades:", e));
  }, [receptor]);

  // === Cancelar o cerrar el modal ===
  const handleCerrar = () => {
    setMsg(null);
    setHabilidadSeleccionada(null);
    cerrar();
  };

  // === Enviar solicitud de intercambio ===
  const handleEnviar = async () => {
    if (!yo?.id_usuario) {
      setMsg({ tipo: "danger", contenido: "No hay sesión activa." });
      return;
    }
    if (!habilidadSeleccionada) {
      setMsg({ tipo: "danger", contenido: "Selecciona una habilidad primero." });
      return;
    }

    setEnviando(true);
    try {
      const body = {
        id_usuario_postulante: yo.id_usuario, // quien envía la solicitud
        id_habilidad: habilidadSeleccionada, // habilidad seleccionada del receptor
      };

      const res = await fetch(`${env.api}/api/intercambios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("No se pudo enviar la solicitud");

      setMsg({
        tipo: "success",
        contenido: "✅ Solicitud enviada correctamente.",
      });

      // cerrar modal después de breve pausa
      setTimeout(() => handleCerrar(), 1500);
    } catch (e) {
      console.error(e);
      setMsg({
        tipo: "danger",
        contenido: "❌ Error al enviar la solicitud.",
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
            <h5 className="modal-title">
              Solicitud de intercambio a{" "}
              {receptor?.nombre ? `${receptor.nombre} ${receptor.apellido || ""}` : ""}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleCerrar}
            />
          </div>

          {/* === BODY === */}
          <div className="modal-body">
            {habilidades.length === 0 ? (
              <p className="text-muted text-center">
                Este usuario aún no tiene habilidades registradas.
              </p>
            ) : (
              <>
                <p className="fw-semibold text-center mb-3">
                  Selecciona una habilidad para solicitar intercambio:
                </p>

                <div className="text-start">
                  {habilidades.map((hab) => (
                    <div
                      key={hab.id_habilidad}
                      className="border rounded p-2 mb-2 d-flex align-items-start"
                    >
                      <input
                        type="radio"
                        name="habilidad"
                        value={hab.id_habilidad}
                        onChange={() => setHabilidadSeleccionada(hab.id_habilidad)}
                        className="form-check-input mt-1"
                      />
                      <label
                        className="ms-2"
                        style={{ cursor: "pointer", flex: 1 }}
                      >
                        <strong>{hab.nombre_habilidad}</strong>
                        <br />
                        <small className="text-muted">
                          {hab.descripcion || "Sin descripción"}
                        </small>
                      </label>
                    </div>
                  ))}
                </div>
              </>
            )}

            {msg && (
              <div className={`alert alert-${msg.tipo} mt-3`} role="alert">
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
              {enviando ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
