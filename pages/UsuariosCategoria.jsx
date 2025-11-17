import Navbar from "../assets/components/Navbar";
import Footer from "../assets/components/Footer";
import CardUsuario from "../assets/components/CardUsuario";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { env } from "../environ";

function UsuariosCategoria() {
  const { id_categoria } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetch(`${env.api}/api/usuarios/categoria/${id_categoria}`).then(
        (response) => response.json()
      ),
      fetch(`${env.api}/api/categorias/${id_categoria}`).then((res) =>
        res.json()
      ),
    ])

      .then(([usuariosData, categoriaData]) => {
        setUsuarios(usuariosData), setCategoria(categoriaData);
      })
      .catch((err) => {
        console.error("Error al cargar datos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id_categoria]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar></Navbar>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        {loading ? (
          <div className="text-center">
            <div
              className="spinner-border"
              style={{ color: "#ff7517" }}
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
            <h4 className="mt-3">Cargando usuarios...</h4>
          </div>
        ) : usuarios && usuarios.length > 0 ? (
          <CardUsuario usuarios={usuarios} titulo=""></CardUsuario>
        ) : (
          <div className="m-5">
            <h4 className="text-center m-5">
              No existen usuarios para la categoría seleccionada!
            </h4>
          </div>
        )}
      </div>
      <Footer></Footer>
    </div>
  );
}

export default UsuariosCategoria;
