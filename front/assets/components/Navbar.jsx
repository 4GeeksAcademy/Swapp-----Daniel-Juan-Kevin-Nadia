import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    if (usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado));
    }
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
      <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
        <div className="container-fluid align-items-center">
          {/* Logo Swapp (redirige a Home) */}
          <Link
            className="navbar-brand d-flex align-items-center logo-container"
            to="/"
          >
            <img className="logo-navbar" src="/logo%20swapp.webp" alt="Swapp" />
          </Link>

          {/* Barra de búsqueda */}
          <form className="d-flex flex-grow-1 mx-3" role="search">
            <input
              className="form-control me-2 w-100"
              type="search"
              placeholder="Buscar"
              aria-label="Search"
            />
            <button className="btn btn-main2" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          {/* Botones de sesión */}
          <div className="d-flex">
            {usuario ? (
              <>
                <Link
                  to="/perfil"
                  className="btn btn-main2 me-2"
                  type="button"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn btn-main1"
                  type="button"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/registro"
                  className="btn btn-main1 me-2"
                  type="button"
                >
                  Regístrate
                </Link>
                <Link to="/login" className="btn btn-main1" type="button">
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* === Navbar secundaria === */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Todas las categorías
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Educación y Tutorías</a></li>
                  <li><a className="dropdown-item" href="#">Tecnología y Programación</a></li>
                  <li><a className="dropdown-item" href="#">Música y Audio</a></li>
                  <li><a className="dropdown-item" href="#">Negocios y Finanzas</a></li>
                  <li><a className="dropdown-item" href="#">Entretenimiento y Cultura</a></li>
                  <li><a className="dropdown-item" href="#">Dibujo y pintura</a></li>
                  <li><a className="dropdown-item" href="#">Deporte y Bienestar</a></li>
                  <li><a className="dropdown-item" href="#">Moda, Belleza y Cuidado Personal</a></li>
                  <li><a className="dropdown-item" href="#">Hogar y Reparaciones</a></li>
                  <li><a className="dropdown-item" href="#">Mascotas y Animales</a></li>
                  <li><a className="dropdown-item" href="#">Viajes y Estilo de Vida</a></li>
                  <li><a className="dropdown-item" href="#">Comunicación y Marketing</a></li>
                  <li><a className="dropdown-item" href="#">Desarrollo Personal y Coaching</a></li>
                  <li><a className="dropdown-item" href="#">Otros / Misceláneos</a></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Educación y Tutorías
                </a>
              </li>
              <li className="nav-item"><a className="nav-link" href="#">Tecnología y Programación</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Música y Audio</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Negocios y Finanzas</a></li>
              <li className="nav-item"><a className="nav-link" href="#">Entretenimiento y Cultura</a></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
