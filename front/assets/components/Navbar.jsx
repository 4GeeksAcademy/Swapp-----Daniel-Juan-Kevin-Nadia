import "../styles/Navbar.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { env } from "../../environ";

function Navbar() {
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
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${env.api}/api/categorias`);
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Deseas cerrar sesión?");
    if (confirmLogout) {
      localStorage.removeItem("usuario");
      setUsuario(null);
      navigate("/login");
    }
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

          {/* <div className="d-flex flex-grow-1 align-items-center mx-3 position-relative">
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
          </div> */}

          {/* Solo móvil */}
          <div className="d-flex flex-column align-items-center d-lg-none w-100">
            <div className="w-100 d-flex justify-content-between">
              <button
                className="btn btn-outline-secondary"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#categoriasSidebar"
                aria-controls="categoriasSidebar"
              >
                <i className="fa-solid fa-bars"></i>
              </button>

              <div className="d-flex">
                {usuario ? (
                  <>
                    <Link to="/perfil" className="btn btn-main2 me-2">
                      Perfil
                    </Link>
                    <button onClick={handleLogout} className="btn btn-main1">
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/registro" className="btn btn-main1 me-2">
                      Regístrate
                    </Link>
                    <Link to="/login" className="btn btn-main1">
                      Iniciar sesión
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <h3 className="d-none d-md-block flex-grow-1 mx-3 text-center mb-0 fst-italic eslogan">
            {/* ¡Donde todo, tiene otro valor! */}
          </h3>
          <div className="d-flex">
            {usuario ? (
              <>
                <Link
                  to="/perfil"
                  className="btn btn-main1 d-none d-lg-flex me-2"
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

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-2">
            {CATEGORIAS_DESTACADAS.map((nombre) => {
              const categoria = categorias?.find(
                (cat) => cat.nombre_categoria === nombre
              );

              return (
                <li key={nombre} className="nav-item me-3">
                  {categoria ? (
                    <NavLink
                      to={`/usuarios/categoria/${categoria.id_categoria}`}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active-link" : ""}`
                      }
                    >
                      {nombre}
                    </NavLink>
                  ) : (
                    <span className="text-muted">{nombre}</span>
                  )}
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
          <ul className="list-unstyled">
            {categorias.map((cat) => (
              <li key={cat.id_categoria}>
                <NavLink
                  to={`/usuarios/categoria/${cat.id_categoria}`}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  }
                  onClick={() => {
                    const offcanvasEl =
                      document.getElementById("categoriasSidebar");
                    const bsOffcanvas =
                      bootstrap.Offcanvas.getInstance(offcanvasEl);
                    if (bsOffcanvas) bsOffcanvas.hide();
                  }}
                >
                  <i
                    className={`${
                      iconosCategorias[cat.nombre_categoria] ||
                      "fa-solid fa-circle"
                    } me-3`}
                  ></i>
                  {cat.nombre_categoria}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
