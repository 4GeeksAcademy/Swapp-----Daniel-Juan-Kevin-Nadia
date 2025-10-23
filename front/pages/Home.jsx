import Navbar from "../assets/components/Navbar";
import Carousel from "../assets/components/Carousel";
import CardUsuario from "../assets/components/CardUsuario";
import Footer from "../assets/components/Footer";
import ModalMensajeria from "../assets/components/ModalMensajeria";
import BotonMensajeria from "../assets/components/BotonMensajeria";
import React, { useState } from "react";


function Home() {
  const [mostrarModal, setMostrarModal] = useState(false);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  return (
    <>
      <Navbar></Navbar>
      <Carousel></Carousel>
      <CardUsuario></CardUsuario>
      <Footer></Footer>

      {usuario ? (
        <>
          <BotonMensajeria onClick={() => setMostrarModal(true)}></BotonMensajeria>
          <ModalMensajeria
            mostrar={mostrarModal}
            cerrar={() => setMostrarModal(false)}>
          </ModalMensajeria>
        </>
      ) : null}

    </>
  );
}

export default Home;
