import React, { useEffect, useMemo, useState } from "react";
import "../styles/ModalMensajeria.css";
import { env } from "../../environ";

/**
 * Props:
 *  - mostrar: boolean
 *  - cerrar: () => void
 *  - receptorId?: number  // (opcional) para abrir directamente el chat con ese usuario
 */
export default function ModalMensajeria({ mostrar, cerrar, receptorId }) {
  const [yo, setYo] = useState(null); // usuario autenticado
  const [recibidos, setRecibidos] = useState([]); // mensajes donde yo soy receptor
  const [enviados, setEnviados] = useState([]); // mensajes donde yo soy emisor
  const [seleccionado, setSeleccionado] = useState(null); // id del otro usuario
  const [texto, setTexto] = useState("");
  // mapa global de nombres
  const [nombres, setNombres] = useState(new Map());
  const nombreDe = (id) => nombres.get(id) || `Usuario ${id}`;

  // 1) Cargar usuario autenticado
  useEffect(() => {
    if (!mostrar) return;
    const raw = localStorage.getItem("token");
    if (!raw) return;

    const token = raw.replace(/^"|"$/g, "");
    fetch(`${env.api}/api/autorizacion`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setYo)
      .catch(console.error);
  }, [mostrar]);

  // 2) Cargar mensajes (cuando tengo mi id)
  useEffect(() => {
    if (!yo?.id_usuario) return;

    const load = async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`${env.api}/api/mensajes/${yo.id_usuario}/recibidos`),
          fetch(`${env.api}/api/mensajes/${yo.id_usuario}/enviados`),
        ]);

        const rec = await r1.json();
        const envs = await r2.json();

        // --- añadimos fetch de usuarios ---
        const usuariosResp = await fetch(`${env.api}/api/usuarios`);
        const usuarios = await usuariosResp.json();
        const mapaUsuarios = new Map(
          usuarios.map((u) => [u.id_usuario, `${u.nombre} ${u.apellido}`])
        );
        setNombres(mapaUsuarios);

        // añadimos nombres a los mensajes
        const procesar = (m) => ({
          ...m,
          emisor_nombre:
            mapaUsuarios.get(m.id_emisor) || `Usuario ${m.id_emisor}`,
          receptor_nombre:
            mapaUsuarios.get(m.id_receptor) || `Usuario ${m.id_receptor}`,
        });

        setRecibidos(Array.isArray(rec) ? rec.map(procesar) : []);
        setEnviados(Array.isArray(envs) ? envs.map(procesar) : []);
      } catch (e) {
        console.error("Error cargando mensajes:", e);
      }
    };
    load();
  }, [yo?.id_usuario]);

  // 3) Unifico y agrupo por contacto (el otro id)
  const { contactos, chatsPorContacto } = useMemo(() => {
    const todos = [...recibidos, ...enviados].sort(
      (a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio)
    );
    const mapa = new Map(); // idOtro -> mensajes[]
    for (const m of todos) {
      const idOtro =
        m.id_emisor === yo?.id_usuario ? m.id_receptor : m.id_emisor;
      if (!mapa.has(idOtro)) mapa.set(idOtro, []);
      mapa.get(idOtro).push(m);
    }
    return {
      contactos: Array.from(mapa.keys()),
      chatsPorContacto: mapa,
    };
  }, [recibidos, enviados, yo?.id_usuario]);

  // 4) Si llega receptorId, lo preselecciono
  useEffect(() => {
    if (receptorId && contactos.includes(receptorId)) {
      setSeleccionado(receptorId);
    } else if (receptorId) {
      // si no hay historial, igualmente dejo seleccionado ese id para poder escribirle
      setSeleccionado(receptorId);
    }
  }, [receptorId, contactos]);

  if (!mostrar) return null;
  if (!yo) return null;

  const chatActual = seleccionado
    ? chatsPorContacto.get(seleccionado) || []
    : [];

  // 5) Enviar
  const onEnviar = async (e) => {
    e.preventDefault();
    const contenido = texto.trim();
    if (!contenido || !seleccionado || !yo?.id_usuario) return;

    const body = {
      contenido,
      id_emisor: Number(yo.id_usuario),
      id_receptor: Number(seleccionado),
    };

    try {
      const res = await fetch(`${env.api}/api/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("No se pudo enviar");
      const nuevo = await res.json();

      // reflejar en UI
      setEnviados((prev) => [
        ...prev,
        {
          ...nuevo,
          emisor_nombre: nombreDe(yo.id_usuario),
          receptor_nombre: nombreDe(seleccionado),
        },
      ]);

      setTexto("");
    } catch (err) {
      console.error(err);
      alert("No se pudo enviar el mensaje.");
    }
  };

  return (
    <div
      className="modal fade show d-block fondo-modal modal-mensajeria"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-dialog modal-xl modal-dialog-centered"
        role="document"
      >
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header bg-naranja text-white">
            <h5 className="modal-title">
              Mensajes de {yo.nombre} {yo.apellido}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={cerrar}
            />
          </div>

          {/* BODY */}
          <div className="modal-body fondo-claro">
            <div className="row g-0">
              {/* LISTA DE CONTACTOS */}
              <div className="col-md-4 border-end bg-white lista-mensajes">
                {contactos.length === 0 && !receptorId ? (
                  <p className="text-center text-muted mt-3">
                    No hay conversaciones todavía.
                  </p>
                ) : (
                  <>
                    {receptorId && !contactos.includes(receptorId) && (
                      <div
                        className={`mensaje-item p-3 border-bottom ${
                          seleccionado === receptorId ? "activo" : ""
                        }`}
                        onClick={() => setSeleccionado(receptorId)}
                      >
                        <strong>{nombreDe(receptorId)}</strong>

                        <div className="text-muted small">Nuevo mensaje…</div>
                      </div>
                    )}
                    {contactos.map((id) => {
                      const ms = chatsPorContacto.get(id) || [];
                      const ultimo = ms[ms.length - 1];
                      return (
                        <div
                          key={id}
                          className={`mensaje-item p-3 border-bottom ${
                            seleccionado === id ? "activo" : ""
                          }`}
                          onClick={() => setSeleccionado(id)}
                        >
                          <div className="d-flex justify-content-between">
                            <div>
                              <strong>
                                {ultimo?.id_emisor === yo.id_usuario
                                  ? `A: ${nombreDe(id)}`
                                  : `De: ${nombreDe(id)}`}
                              </strong>
                              <div className="text-muted small">
                                {ultimo?.contenido
                                  ? `${ultimo.contenido.slice(0, 28)}…`
                                  : ""}
                              </div>
                            </div>
                            <small className="text-muted">
                              {ultimo?.fecha_envio
                                ? new Date(
                                    ultimo.fecha_envio
                                  ).toLocaleDateString("es-ES")
                                : ""}
                            </small>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* CHAT */}
              <div className="col-md-8 bg-white d-flex flex-column detalle-mensaje">
                <div className="p-3 flex-grow-1 texto-mensaje">
                  {!seleccionado ? (
                    <p className="text-center text-muted mt-5">
                      Selecciona un contacto para chatear.
                    </p>
                  ) : chatActual.length === 0 ? (
                    <p className="text-center text-muted mt-5">
                      Aún no hay mensajes. ¡Escribe el primero!
                    </p>
                  ) : (
                    chatActual.map((m) => (
                      <div
                        key={m.id_mensaje}
                        className={`mb-2 d-flex ${
                          m.id_emisor === yo.id_usuario
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                      >
                        <div
                          className={
                            m.id_emisor === yo.id_usuario
                              ? "mensaje-enviado"
                              : "mensaje-recibido"
                          }
                        >
                          <p className="mb-1">{m.contenido}</p>
                          <small className="text-muted">
                            {new Date(m.fecha_envio).toLocaleTimeString(
                              "es-ES",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </small>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* ENVIAR */}
                {seleccionado && (
                  <form className="p-3 border-top" onSubmit={onEnviar}>
                    <div className="mb-2">
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Escribe tu mensaje..."
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                      />
                    </div>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-naranja fw-semibold"
                      >
                        📤 Enviar mensaje
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}