import "../styles/Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary mt-2 p-0">
        <div className="container-fluid  d-flex justify-content-center align-items-center">
          <a
            className="navbar-brand d-flex  align-items-center logo-container"
            href="#"
          >
            <img className="logo-navbar" src="logo swapp.webp" />
          </a>

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
            <Link
              to="/registro"
              className="btn btn-main1 d-none d-lg-flex me-2"
              type="submit"
            >
              Regístrate
            </Link>
            <button className="btn btn-main1 d-none d-lg-flex" type="submit">
              Inicia sesión
            </button>
          </div>
        </div>
      </nav>
      <hr></hr>
      <nav className="navbar navbar-expand-lg navbar-light bg-light p-0">
        <div className="container-fluid">
          <button
            className="btn boton-hamburguer d-none d-lg-flex"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#categoriasSidebar"
            aria-controls="categoriasSidebar"
          >
            <i className="fa-solid fa-bars me-1 mt-1"></i> Todas las categorías
          </button>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-5">
            <li className="nav-item me-3">
              <a className="active" aria-current="page" href="#">
                Educación y Tutorías
              </a>
            </li>
            <li className="nav-item me-3">
              <a href="#">Tecnología y Programación</a>
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
            <Link
              to="/registro"
              className="btn btn-main1 boton-registro me-2"
              type="submit"
            >
              Regístrate
            </Link>
            <button className="btn btn-main1 boton-inicio" type="submit">
              Inicia sesión
            </button>
          </div>
          <ul className="list-unstyled">
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
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
