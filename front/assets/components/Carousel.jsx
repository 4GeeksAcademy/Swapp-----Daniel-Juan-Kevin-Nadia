import "../styles/Carousel.css";

function Carousel() {
  return (
    <>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col">
            <div
              id="carouselExampleAutoplaying"
              data-bs-interval="3000"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="slide1.png"
                    className="d-block w-100 "
                    alt="Imagen 1"
                  />
                  <div className="slide-text left">
                    <h3>Intercambia tiempo, no dinero</h3>
                    <br></br>
                    <p className="fs-5">
                      En <strong>Swapp</strong>, compartes lo que sabes y
                      aprendes lo que te apasiona. Enseña cualquier habilidad y
                      recibe clases a cambio, sin pagar nada.
                    </p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img
                    src="slide3.png"
                    className="d-block w-100 "
                    alt="Imagen 2"
                  />
                  <div className="slide-text left">
                    <h3>Aprende enseñando, enseña aprendiendo</h3>
                    <br></br>
                    <p className="fs-5">
                      Conecta con personas de todo el mundo y <br></br>{" "}
                      convierte el conocimiento en un intercambio<br></br>{" "}
                      humano, donde todos tenemos algo que ofrecer.
                    </p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img
                    src="slide2.jpg"
                    className="d-block w-100 "
                    alt="Imagen 3"
                  />
                  <div className="slide-text left">
                    <h3>Únete al trueque del conocimiento</h3>
                    <br></br>
                    <p className="fs-5">
                      Crea tu perfil, comparte tus habilidades, descubre nuevas
                      pasiones y haz tu primer <strong>Swapp</strong> hoy.
                      <br />
                      #ComparteTuTalento
                    </p>
                  </div>
                </div>
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleAutoplaying"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Carousel;
