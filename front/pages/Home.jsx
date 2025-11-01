import Navbar from "../assets/components/Navbar";
import Carousel from "../assets/components/Carousel";
import CardUsuario from "../assets/components/CardUsuario";
import Footer from "../assets/components/Footer";
import ModalMensajeria from "../assets/components/ModalMensajeria";
import BotonMensajeria from "../assets/components/BotonMensajeria";
import React, { useState, useEffect } from "react";
import { env } from "../environ";

function Home() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    fetch(`${env.api}/api/usuarios`)
      .then((res) => res.json())
      .then((data) => setUsuarios(data.slice(0, 8)))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <Carousel></Carousel>
      <CardUsuario usuarios={usuarios} titulo="Recomendados"></CardUsuario>
      <Footer></Footer>

      {usuario ? (
        <>
          <BotonMensajeria
            onClick={() => setMostrarModal(true)}
          ></BotonMensajeria>
          <ModalMensajeria
            mostrar={mostrarModal}
            cerrar={() => setMostrarModal(false)}
          ></ModalMensajeria>
        </>
      ) : null}
    </>
  );
}

export default Home;
