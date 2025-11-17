import Navbar from "../assets/components/Navbar";
import Carousel from "../assets/components/Carousel";
import CardUsuario from "../assets/components/CardUsuario";
import Footer from "../assets/components/Footer";
import ModalMensajeria from "../assets/components/ModalMensajeria";
import BotonMensajeria from "../assets/components/BotonMensajeria";
import React, { useState, useEffect } from "react";
import { env } from "../environ";
import { useStore } from "../hooks/useStore";

function Home() {
  const { store, dispatch } = useStore();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuario, setUsuario] = useState();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch(`${env.api}/api/autorizacion`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            setUsuario(data);
            dispatch({ type: "SET_USUARIO", payload: data });
          }
        })
        .catch((err) => console.error("Error al cargar usuario:", err));
      dispatch({ type: "SET_TOKEN", payload: token });
    }

    fetch(`${env.api}/api/usuarios`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          dispatch({ type: "SET_USUARIOS", payload: data });
        }
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));

    fetch(`${env.api}/api/categorias`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          dispatch({ type: "SET_CATEGORIAS", payload: data });
        }
      })
      .catch((err) => console.error("Error al cargar Categorias:", err));
  }, []);

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
      ) : (
        ""
      )}
    </>
  );
}

export default Home;
