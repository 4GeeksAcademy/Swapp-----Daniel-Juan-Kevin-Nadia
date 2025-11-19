import "./assets/styles/App.css";
import { StoreProvider } from "./hooks/useStore.jsx";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import PerfilUsuario from "./pages/PerfilUsuario";
import PerfilPublico from "./pages/PerfilPublico";
import UsuariosCategoria from "./pages/UsuariosCategoria.jsx";

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/usuario/:id_usuario" element={<PerfilPublico />} />
        <Route
          path="/usuarios/categoria/:id_categoria"
          element={<UsuariosCategoria />}
        ></Route>
      </Routes>
    </StoreProvider>
  );
}
