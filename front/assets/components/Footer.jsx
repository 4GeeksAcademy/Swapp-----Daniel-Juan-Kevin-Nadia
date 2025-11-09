import "../styles/Footer.css";

function Footer() {
  return (
    <>
      <div className="container-fluid mt-5">
        <div className="row links-footer">
          <div className="row d-flex justify-content-center d-lg-none">
            <div className="col-12 logo-container-footer ">
              <img
                className="logo-footer "
                src="/logo-swapp.webp"
                alt="logo"
              ></img>
            </div>
          </div>
          <div className=" col-md-2 d-none d-lg-flex logo-container-footer ">
            <img
              className="logo-footer img-fluid"
              src="/logo-swapp.webp"
              alt="logo"
            ></img>
          </div>

          <div className="col-6 col-md-3">
            <h5>Swapp</h5>
            <ul className="list-unstyled list">
              <li>
                <a className="text-dark" href="#">
                  Acerca de nosotros
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Blog de noticias
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Cómo funciona
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Trabaja con nosotros
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h5>Soporte</h5>
            <ul className="list-unstyled list">
              <li>
                <a className="text-dark" href="#">
                  Centro de ayuda
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Preguntas frecuentes
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Contacta con nosotros
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-3">
            <h5>Legal</h5>
            <ul className="list-unstyled list ">
              <li>
                <a className="text-dark" href="#">
                  Aviso legal
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Condiciones de uso
                </a>
              </li>
              <li>
                <a className="text-dark" href="#">
                  Política de privacidad
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md-1 text-start">
            <h5>Síguenos</h5>
            <div className=" d-flex justify-content-start">
              <i className="fa-brands fa-facebook mt-3 me-2 fs-3"></i>
              <i className="fa-brands fa-instagram mt-3 me-2 fs-3"></i>

              <i className="fa-brands fa-x-twitter mt-3 me-2 fs-3"></i>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <hr></hr>
            <p>© 2025 Swapp. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
