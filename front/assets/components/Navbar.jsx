import "../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
        <div className="container-fluid  align-items-center">
          <a
            className="navbar-brand d-flex  align-items-center logo-container"
            href="#"
          >
            <img className="logo-navbar" src="logo swapp.webp" />
          </a>

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
          {/* <h5>Swapp, donde todo tiene otro valor.</h5> */}
          <div className="d-flex">
            <Link to="/registro" className="btn btn-main1 me-2" type="submit">
              Regístrate
            </Link>
            <button className="btn btn-main1" type="submit">
              Inicia sesión
            </button>
          </div>
        </div>
      </nav>
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
                  <li>
                    <a className="dropdown-item" href="#">
                      Educación y Tutorías
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Tecnología y Programación
                    </a>
                  </li>

                  <li>
                    <a className="dropdown-item" href="#">
                      Música y Audio
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Negocios y Finanzas
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Entretenimiento y Cultura
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Dibujo y pintura
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Deporte y Bienestar
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Moda, Belleza y Cuidado Personal
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Hogar y Reparaciones
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Mascotas y Animales
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Viajes y Estilo de Vida
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Comunicación y Marketing
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Desarrollo Personal y Coaching
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Otros / Misceláneos
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Educación y Tutorías
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Tecnología y Programación
                </a>
              </li>

              <li className="nav-item">
                <a className="nav-link" href="#">
                  Música y Audio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Negocios y Finanzas
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Entretenimiento y Cultura
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
