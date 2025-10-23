import "../styles/BotonMensajeria.css";

export default function BotonMensajeria({ onClick }) {
    return (
        <button onClick={onClick} className="boton-mensajeria fw-semibold">
            💬 Mensajes
        </button>
    );
}