import React, { useState } from "react";
import "../styles/ModalPuntuacion.css";

const ModalPuntuacion = ({ mostrar, onClose, usuarioEvaluado, onSubmit }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");

  if (!mostrar) return null;

  const handleSubmit = () => {
    if (puntuacion === 0) {
      alert("Por favor selecciona una puntuación antes de enviar.");
      return;
    }
    onSubmit({
      id_usuario_evaluado: usuarioEvaluado?.id_usuario,
      puntuacion,
      comentario,
    });
    setPuntuacion(0);
    setComentario("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-contenido animate-fadeIn">
        <h3 className="modal-titulo">
          Califica a <span className="nombre-usuario">{usuarioEvaluado?.nombre}</span>
        </h3>

        {/* === Estrellas === */}
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

        {/* === Comentario === */}
        <textarea
          className="modal-comentario"
          placeholder="Agrega un comentario (opcional)"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={250}
        />

        {/* === Botones === */}
        <div className="modal-botones">
          <button className="btn btn-editar-foto" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn perfil-accion-btn" onClick={handleSubmit}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPuntuacion;
