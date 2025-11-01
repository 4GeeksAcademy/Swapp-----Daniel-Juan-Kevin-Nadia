import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { env } from "../../environ";
import { useStore } from "../../hooks/useStore";

function Navbar() {
  const {store, dispatch} = useStore();
  const [usuario, setUsuario] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  const CATEGORIAS_DESTACADAS = [
    "Educación y Tutorías",
    "Tecnología y Programación",
    "Música y Audio",
    "Negocios y Finanzas",
    "Entretenimiento y Cultura",
  ];
  const iconosCategorias = {
    "Educación y Tutorías": "fa-solid fa-graduation-cap",
    "Tecnología y Programación": "fa-solid fa-square-binary",
    "Música y Audio": "fa-solid fa-play",
    "Negocios y Finanzas": "fa-solid fa-money-bill-trend-up",
    "Entretenimiento y Cultura": "fa-solid fa-masks-theater",
    "Dibujo y pintura": "fa-solid fa-palette",
    "Deporte y Bienestar": "fa-solid fa-heart",
    "Moda, Belleza y Cuidado Personal": "fa-solid fa-hand-sparkles",
    "Hogar y Reparaciones": "fa-solid fa-screwdriver-wrench",
    "Mascotas y Animales": "fa-solid fa-paw",
    "Viajes y Estilo de Vida": "fa-solid fa-suitcase",
    "Comunicación y Marketing": "fa-solid fa-bullhorn",
    "Desarrollo Personal y Coaching": "fa-solid fa-child-reaching",
    "Otros / Misceláneos": "fa-solid fa-puzzle-piece",
  };
 
  useEffect(() => {
    const usuarioGuardado = store.usuario;
    if (Object.keys(usuarioGuardado).length > 0) {
      setUsuario(usuarioGuardado);
    }

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${env.api}/api/categorias`);
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        setCategorias(data);
        dispatch({type: "SET_CATEGORIAS", payload: data});
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
    if (confirmLogout) {
      setUsuario(null);
      dispatch({type: "SET_USUARIO", payload: {}});
      dispatch({type: "SET_TOKEN", payload: ""});
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleClickCategoria = (id_categoria) => {
    navigate(`/usuarios/categoria/${id_categoria}`);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary mt-2 p-0">
        <div className="container-fluid  d-flex justify-content-center align-items-center">
          <Link
            className="navbar-brand d-flex  align-items-center logo-navbar-container"
            to="/"
          >
            <img
              className="logo-navbar"
              src="/logo swapp.webp"
              alt="logo Swapp"
            />
          </Link>

          <div className="d-flex flex-grow-1 align-items-center mx-3 position-relative">
            <form className="d-flex flex-grow-1 me-2 ms-0" role="search">
              <div className="input-group w-100">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Buscar"
                  aria-label="Search"
                />
                <button className="btn btn-main2" type="submit">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
            </form>
            <button
              className="btn btn-outline-secondary d-lg-none"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#categoriasSidebar"
              aria-controls="categoriasSidebar"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>

          {/* <h5>Swapp, donde todo tiene otro valor.</h5> */}
          <div className="d-flex">
            {usuario ? (
              <>
                <Link
                  to="/perfil"
                  className="btn btn-main2 d-none d-lg-flex me-2"
                  type="button"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-main1 d-none d-lg-flex"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/registro"
                  className="btn btn-main1 d-none d-lg-flex me-2"
                  type="button"
                >
                  Regístrate
                </Link>
                <Link
                  to="/login"
                  className="btn btn-main1 d-none d-lg-flex"
                  type="button"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <hr></hr>

      {/* ***************** SEGUNDA NAVBAR ********************** */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-0">
        <div className="container-fluid">
          <button
            className="btn boton-hamburguer d-none d-lg-flex"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#categoriasSidebar"
            aria-controls="categoriasSidebar"
          >
            <i className="fa-solid fa-bars mt-1"></i>Todas las categorías
          </button>
          {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-2">
            <li className="nav-item me-3">
              <a
                className="active"
                aria-current="page"
                href="#"
                // onClick={() => handleClickCategoria(educacion)}
              >
                Educación y Tutorías
              </a>
            </li>
            <li className="nav-item me-3">
              <a
                href="#"
                // onClick={() => handleClickCategoria(tecnologia)}
              >
                {" "}
                Tecnología y Programación
              </a>
            </li>

            <li className="nav-item me-3">
              <a href="#">Música y Audio</a>
            </li>
            <li className="nav-item me-3 ">
              <a href="#">Negocios y Finanzas</a>
            </li>
            <li className="nav-item">
              <a href="#">Entretenimiento y Cultura</a>
            </li>
          </ul> */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-2">
            {CATEGORIAS_DESTACADAS.map((nombre) => {
              const categoria = categorias?.find(
                (cat) => cat.nombre_categoria === nombre
              );

              return (
                <li key={nombre} className="nav-item me-3">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (categoria)
                        handleClickCategoria(categoria.id_categoria);
                    }}
                  >
                    {nombre}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div
        className="offcanvas offcanvas-start no-scroll"
        tabIndex="-1"
        id="categoriasSidebar"
        aria-labelledby="categoriasSidebarLabel"
      >
        <div className="offcanvas-header">
          <h4 className="offcanvas-title fw-bold" id="categoriasSidebarLabel">
            Categorías
          </h4>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="d-flex justify-content-center d-lg-none mb-3">
            {usuario ? (
              <>
                <Link
                  to="/perfil"
                  className="btn btn-main2 boton-registro me-2"
                  type="button"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-main1 boton-inicio"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/registro"
                  className="btn btn-main1 boton-registro me-2"
                  type="button"
                >
                  Regístrate
                </Link>
                <Link
                  to="/login"
                  className="btn btn-main1 boton-inicio"
                  type="button"
                >
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>

          {/* <ul className="list-unstyled">
            <li>
              <a href="#">
                <i className="fa-solid fa-graduation-cap me-3"></i>Educación y
                Tutorías
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-square-binary me-3"></i>Tecnología y
                Programación
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-play me-3"></i>Música y Audio
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-money-bill-trend-up me-3"></i>Negocios
                y Finanzas
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-masks-theater me-3"></i>
                Entretenimiento y Cultura
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-palette me-3"></i>Dibujo y pintura
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-heart me-3"></i>Deporte y Bienestar
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-hand-sparkles me-3"></i>Moda, Belleza
                y Cuidado Personal
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-screwdriver-wrench me-3"></i>Hogar y
                Reparaciones
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-paw me-3"></i>Mascotas y Animales
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-suitcase me-3"></i>Viajes y Estilo de
                Vida
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-bullhorn me-3"></i>Comunicación y
                Marketing
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-child-reaching me-3"></i>Desarrollo
                Personal y Coaching
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa-solid fa-puzzle-piece me-3"></i>Otros /
                Misceláneos
              </a>
            </li>
          </ul> */}
          <ul className="list-unstyled">
            {categorias.map((cat) => (
              <li key={cat.id_categoria}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClickCategoria(cat.id_categoria);
                  }}
                >
                  <i
                    className={`${
                      iconosCategorias[cat.nombre_categoria] ||
                      "fa-solid fa-circle"
                    } me-3`}
                  ></i>
                  {cat.nombre_categoria}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
