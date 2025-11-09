import "../styles/Navbar.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { env } from "../../environ";
import { useStore } from "../../hooks/useStore";

function Navbar() {
  const { store, dispatch } = useStore();
  const [usuario, setUsuario] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();
  const isLogged = !!(
    usuario ||
    localStorage.getItem("token") ||
    localStorage.getItem("user")
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
    const fromStore =
      store?.usuario && Object.keys(store.usuario).length > 0
        ? store.usuario
        : null;

    const fromLocal = JSON.parse(localStorage.getItem("user") || "null");

    if (fromStore) {
      setUsuario(fromStore);
    } else if (fromLocal) {
      setUsuario({
        nombre: fromLocal.nombre,
        apellido: fromLocal.apellido,
        correo_electronico: fromLocal.email,
        foto_perfil: fromLocal.picture,
      });
    } else {
      setUsuario(null);
    }

    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${env.api}/api/categorias`);
        if (!response.ok) throw new Error("Error al obtener categorías");
        const data = await response.json();
        setCategorias(data);
        dispatch({ type: "SET_CATEGORIAS", payload: data });
      } catch (error) {
        console.error("Error cargando categorías:", error);
      }
    };
    fetchCategorias();
  }, [store.usuario, dispatch]);

  const handleLogout = async () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      const usuarioGoogle = localStorage.getItem("user");

      if (usuarioGoogle) {
        await fetch(`${env.api}/api/logout`, { method: "POST" });
        localStorage.removeItem("user");
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      dispatch({ type: "SET_USUARIO", payload: {} });
      dispatch({ type: "SET_TOKEN", payload: "" });
      setUsuario(null);

      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.clear();
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
              src="/logo-swapp.webp"
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
            {isLogged ? (
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
                {showLogoutModal && (
                  <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    role="dialog"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <div
                      className="modal-dialog modal-dialog-centered"
                      role="document"
                    >
                      <div className="modal-content text-center p-3">
                        <div className="modal-body">
                          <p>¿Estás seguro de que deseas cerrar sesión?</p>
                        </div>
                        <div className="modal-footer border-0 d-flex justify-content-center gap-3">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setShowLogoutModal(false)}
                          >
                            Cancelar
                          </button>
                          <button
                            className="btn btn-main1"
                            onClick={() => {
                              setShowLogoutModal(false);
                              confirmLogout();
                            }}
                          >
                            Cerrar sesión
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
