import React, { useState } from "react";
import "../styles/ModalMensajeria.css";

export default function ModalMensajeria({ mostrar, cerrar }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [seleccionado, setSeleccionado] = useState(0);

    if (!usuario) return null;

    // 🔸 Datos de ejemplo simulando mensajes
    const mensajes = [
        {
            id_mensaje: 1,
            emisor_nombre: "Laura García",
            receptor_nombre: usuario.nombre,
            fecha_envio: "2025-10-23T10:30:00",
            contenido: "Hola vi que eres profesor de inglés, te gustaria aprender a hacer postres",
            visto: false,
        },
        {
            id_mensaje: 2,
            emisor_nombre: usuario.nombre,
            receptor_nombre: "Laura García",
            fecha_envio: "2025-10-23T10:42:00",
            contenido: "¡Hola Laura! Sí, podría interesarme. ¿Podrías contarme más?",
            visto: true,
        },
    ];

    const contacto = mensajes[0].emisor_nombre;
    const mensajeActual = mensajes[seleccionado];

    return (
        <>
            {mostrar ? (
                <div className="modal fade show d-block fondo-modal" tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            {/* HEADER */}
                            <div className="modal-header bg-naranja text-white">
                                <h5 className="modal-title">
                                    Mensajes para {usuario.nombre}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={cerrar}
                                ></button>
                            </div>

                            {/* BODY */}
                            <div className="modal-body fondo-claro">
                                <div className="row g-0">
                                    {/* LISTA DE CONTACTOS */}
                                    <div className="col-md-4 border-end bg-white lista-mensajes">
                                        <div
                                            className={`mensaje-item p-3 border-bottom ${seleccionado === 0 ? "activo" : ""
                                                }`}
                                            onClick={() => setSeleccionado(0)}
                                        >
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <strong>{contacto}</strong>
                                                    <div className="text-muted small">
                                                        {mensajes[0].visto ? "Leído" : "No leído"}
                                                    </div>
                                                </div>
                                                <small className="text-muted">
                                                    {new Date(
                                                        mensajes[0].fecha_envio
                                                    ).toLocaleDateString("es-ES")}
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DETALLE DE CONVERSACIÓN */}
                                    <div className="col-md-8 bg-white d-flex flex-column detalle-mensaje">
                                        <div className="p-3 border-bottom">
                                            <div className="d-flex justify-content-between">
                                                <div>
                                                    <p className="mb-1">
                                                        <strong>De:</strong> {mensajeActual.emisor_nombre}
                                                    </p>
                                                    <p className="mb-0">
                                                        <strong>Para:</strong>{" "}
                                                        {mensajeActual.receptor_nombre}
                                                    </p>
                                                </div>
                                                <div className="text-end">
                                                    <small className="text-muted d-block">
                                                        {new Date(
                                                            mensajeActual.fecha_envio
                                                        ).toLocaleString("es-ES")}
                                                    </small>
                                                    <span
                                                        className={`estado ${mensajeActual.visto ? "leido" : "no-leido"
                                                            }`}
                                                    >
                                                        {mensajeActual.visto ? "Leído" : "No leído"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mensajes simulados */}
                                        <div className="p-3 flex-grow-1 texto-mensaje">
                                            <div className="mensaje-recibido mb-3">
                                                <p>{mensajes[0].contenido}</p>
                                            </div>
                                            <div className="mensaje-enviado text-end">
                                                <p>{mensajes[1].contenido}</p>
                                            </div>
                                        </div>

                                        {/* RESPUESTA */}
                                        <form className="p-3 border-top">
                                            <div className="mb-2">
                                                <textarea
                                                    className="form-control"
                                                    rows="2"
                                                    placeholder="Escribe tu respuesta..."
                                                ></textarea>
                                            </div>
                                            <div className="text-end">
                                                <button
                                                    type="submit"
                                                    className="btn btn-naranja fw-semibold"
                                                >
                                                    Responder
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
