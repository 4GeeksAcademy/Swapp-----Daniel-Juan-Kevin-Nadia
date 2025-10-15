import "./assets/styles/App.css";
import Navbar from "./assets/components/Navbar";
import Footer from "./assets/components/Footer";
import Carousel from "./assets/components/Carousel";
import CardUsuario from "./assets/components/CardUsuario";

export default function App() {
  return (
    <>
      <Navbar></Navbar>
      <Carousel></Carousel>
      <CardUsuario></CardUsuario>
      <Footer></Footer>
    </>
  );
}
