import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CardUsuario.css";
import { env } from "../../environ";

function CardUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  // const [puntuacion, setPuntuacion] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${env.api}/api/usuarios`)
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data.slice(0, 8));
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  const handleVerPerfil = (id_usuario) => {
    navigate(`/usuario/${id_usuario}`);
  };

  return (
    <>
      <div className="container-fluid mt-5">
        <h3 className="text-center texto-recomendados">Recomendados</h3>
        <div className="row mt-5">
          {usuarios.map((usuario) => (
            <div className="col-md-3 mb-4 " key={usuario.id_usuario}>
              <div className="card  h-100 mx-2">
                <div className="card-header d-flex justify-content-between">
                  <img
                    src={usuario.foto_perfil || "/swapp-profile.png"}
                    className="card-img-top foto-perfil"
                    alt={usuario.nombre}
                  />
                  <button
                    className="btn btn-main1 px-4"
                    type="button"
                    onClick={() => handleVerPerfil(usuario.id_usuario)} // ✅ botón redirige
                  >
                    Ver perfil
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title  text-center">
                    {usuario.nombre} {usuario.apellido}
                  </h5>
                  <p className="card-text  text-center text-limit ">
                    {usuario.descripcion || "Sin descripción"}
                  </p>
                </div>
                <div className="d-flex justify-content-between m-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {[1, 2, 3, 4, 5].map((num) => {
                        const puntuacion = usuario.puntuacion || 0;
                        let star = " fa-regular fa-star text-secondary";
                        if (num <= Math.floor(puntuacion)) {
                          star = "fa-solid fa-star text-warning";
                        } else if (num - 0.5 <= puntuacion) {
                          star = "fa-solid fa-star-half-stroke text-warning";
                        } else if (puntuacion === 0) {
                          star = " fa-regular fa-star text-secondary";
                        }
                        return <i key={num} className={star}></i>;
                      })}
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div
                      className="rounded-circle"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor:
                          usuario.estado === "en-linea"
                            ? "green"
                            : usuario.estado === "ausente"
                            ? "grey"
                            : usuario.estado === "ocupado"
                            ? "red"
                            : "lightgray",
                      }}
                    ></div>
                    <p> {usuario.estado}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr></hr>
      </div>
    </>
  );
}

export default CardUsuario;
