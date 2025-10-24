import "./assets/styles/App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import PerfilUsuario from "./pages/PerfilUsuario";
import PerfilPublico from "./pages/PerfilPublico";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/usuario/:id" element={<PerfilPublico />} />
      </Routes>
    </>
  );
}
