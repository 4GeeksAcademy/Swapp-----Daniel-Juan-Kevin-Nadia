import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CardUsuario.css";

function CardUsuario() {
  const [usuarios, setUsuarios] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://68e8dfb5f2707e6128cc97d2.mockapi.io/api/usuario")
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data.slice(0, 8));
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);
  const handleVerPerfil = (id) => {
    navigate(`/usuario/${id}`);
  };

  return (
    <>
      <div className="container-fluid mt-5">
        <h3 className="text-center texto-recomendados">Recomendados</h3>
        <div className="row mt-5">
          {usuarios.map((usuario) => (
            <div className="col-md-3 mb-4 " key={usuario.id}>
              <div className="card  h-100 mx-2">
                <div className="card-header d-flex justify-content-between">
                  <img
                    src={usuario.foto_perfil || "No hay foto"}
                    className="card-img-top foto-perfil"
                    alt={usuario.nombre}
                  />
                  <button
                    className="btn btn-main1 px-4"
                    type="button"
                    onClick={() => handleVerPerfil(usuario.id)} // ✅ botón redirige
                  >
                    Ver perfil
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title  text-center">
                    {usuario.nombre} {usuario.apellidos}
                  </h5>
                  <p className="card-text  text-center text-limit ">
                    {usuario.descripcion || "Sin descripción"}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fa-star ${
                            i < usuario.puntuacion
                              ? "fa-solid text-warning"
                              : "fa-regular text-secondary"
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <div
                      className="rounded-circle"
                      style={{
                        width: "12px",
                        height: "12px",
                        backgroundColor: usuario.estado ? "green" : "gray",
                      }}
                    >
                      {usuario.estado}
                    </div>
                    <p className="">
                      {usuario.estado ? "En línea" : "Ausente"}
                    </p>
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
