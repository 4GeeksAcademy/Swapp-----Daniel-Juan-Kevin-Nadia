import React, { useState } from "react";
import "../styles/ModalPuntuacion.css";
import { env } from "../../environ";

// helper token
const getTokenLimpio = () => {
  const raw = localStorage.getItem("token");
  return raw ? raw.replace(/^"|"$/g, "") : null;
};

const ModalPuntuacion = ({ mostrar, onClose, usuarioEvaluado, onSubmit }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  if (!mostrar) return null;

  const handleSubmit = async () => {
    // validación local mínima
    if (!usuarioEvaluado || !usuarioEvaluado.id_intercambio) {
      setMensaje({ tipo: "error", texto: "Falta el id del intercambio." });
      return;
    }
    if (!puntuacion || Number(puntuacion) < 1 || Number(puntuacion) > 5) {
      setMensaje({ tipo: "error", texto: "Selecciona una puntuación válida (1-5)." });
      return;
    }

    setCargando(true);
    try {
      const token = getTokenLimpio();
      if (!token) throw new Error("Token no encontrado");

      // usuario autenticado
      const rUser = await fetch(`${env.api}/api/autorizacion`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!rUser.ok) throw new Error("No se pudo obtener usuario autenticado");
      const yo = await rUser.json();

      const id_puntuador = yo?.id_usuario ?? yo?.id;
      if (!id_puntuador) throw new Error("Falta id del usuario autenticado");

      // cuerpo EXACTO que pide el backend
      const body = {
        id_intercambio: usuarioEvaluado.id_intercambio,
        id_puntuador,
        puntos: Number(puntuacion),
        comentario,
      };

      const res = await fetch(`${env.api}/api/puntuaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      // manejo de errores del backend
      let data = null;
      try { data = await res.json(); } catch (_) {}
      if (!res.ok) {
        const msg = (data && (data.error || data.mensaje)) || "Error al enviar puntuación";
        throw new Error(msg);
      }

      setMensaje({ tipo: "success", texto: "Puntuación enviada correctamente." });

      // notificar finalizar y refrescar
      onSubmit?.({
        puntuacion: Number(puntuacion),
        comentario,
      });

      setTimeout(() => {
        setPuntuacion(0);
        setComentario("");
        setMensaje(null);
        setCargando(false);
        onClose();
      }, 800);
    } catch (err) {
      console.error("Error al enviar puntuación:", err);
      setMensaje({ tipo: "error", texto: "Hubo un error al enviar la puntuación." });
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido animate-fadeIn">
        <h3 className="modal-titulo">
          Califica a <span className="nombre-usuario">{usuarioEvaluado?.nombre || "el usuario"}</span>
        </h3>

        <div className="modal-estrellas">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={`estrella ${n <= puntuacion ? "activa" : ""}`}
              onClick={() => setPuntuacion(n)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="modal-comentario"
          placeholder="Agrega un comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={250}
        />

        {mensaje && (
          <div className={`alert mt-3 ${mensaje.tipo === "success" ? "alert-success" : "alert-danger"}`} role="alert">
            {mensaje.texto}
          </div>
        )}

        <div className="modal-puntuacion-botones mt-4">
          <button className="btn-cancelar-puntuacion" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
          <button className="btn-guardar-puntuacion" onClick={handleSubmit} disabled={cargando}>
            {cargando ? "Guardando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPuntuacion;
