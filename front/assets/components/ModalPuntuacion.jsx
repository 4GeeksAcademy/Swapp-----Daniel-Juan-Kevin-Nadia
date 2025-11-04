import React, { useState } from "react";
import "../styles/ModalPuntuacion.css";
import { env } from "../../environ";

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
    if (puntuacion === 0) {
      setMensaje({
        tipo: "error",
        texto: "Por favor selecciona una puntuación antes de enviar.",
      });
      return;
    }

    setCargando(true);
    try {
      const token = getTokenLimpio();
      const userData = JSON.parse(localStorage.getItem("user"));
      const idPuntuador = userData?.id_usuario;

      if (!idPuntuador) {
        throw new Error("Usuario no autenticado");
      }

      const res = await fetch(`${env.api}/api/puntuaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_intercambio: usuarioEvaluado?.id_intercambio,
          id_puntuador: idPuntuador,
          puntos: puntuacion,
          comentario,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.msj || "Error al enviar puntuación");

      setMensaje({
        tipo: "success",
        texto: "¡Puntuación enviada correctamente!",
      });

      onSubmit?.({
        id_intercambio: usuarioEvaluado?.id_intercambio,
        id_usuario_evaluado: usuarioEvaluado?.id_usuario,
        puntos: puntuacion,
        comentario,
      });

      setTimeout(() => {
        setPuntuacion(0);
        setComentario("");
        setMensaje(null);
        setCargando(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al enviar puntuación:", error);
      setMensaje({
        tipo: "error",
        texto: "Hubo un error al enviar la puntuación.",
      });
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido animate-fadeIn">
        <h3 className="modal-titulo">
          Califica a{" "}
          <span className="nombre-usuario">{usuarioEvaluado?.nombre}</span>
        </h3>

        {/* Estrellas */}
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

        {/* Comentario */}
        <textarea
          className="modal-comentario"
          placeholder="Agrega un comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={250}
        />

        {/* Mensaje */}
        {mensaje && (
          <div
            className={`alert mt-3 ${
              mensaje.tipo === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {mensaje.texto}
          </div>
        )}

        {/* Botones */}
        <div className="modal-puntuacion-botones mt-4">
          <button
            className="btn-cancelar-puntuacion"
            onClick={onClose}
            disabled={cargando}
          >
            Cancelar
          </button>
          <button
            className="btn-guardar-puntuacion"
            onClick={handleSubmit}
            disabled={cargando}
          >
            {cargando ? "Guardando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPuntuacion;
