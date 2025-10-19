import "./assets/styles/App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Registro from "./pages/Registro";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </>
  );
}
