import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingButton from "../components/FloatingButton";


function MantenimientosPage() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/mantenimientos")
      .then(res => setMantenimientos(res.data))
      .catch(() => toast.error("❌ Error al cargar mantenimientos"));
  }, []);

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" autoClose={2000} />

      <h1 style={{ textAlign: "center", color: "#0077b6", marginBottom: "2rem" }}>
        Historial de Mantenimientos
      </h1>

      {/* BOTONES DE NAVEGACIÓN */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem", gap: "1rem" }}>
        <button
          onClick={() => navigate("/inicio")}
          style={btn("#90e0ef", "#03045e")}
        >
          ⬅️ Volver al inicio
        </button>
        <button
          onClick={() => navigate("/equipos")}
          style={btn("#0077b6", "white")}
        >
          ⚙️ Ir a Equipos
        </button>
        <button
          onClick={() => navigate("/mantenimientos/nuevo")}
          style={btn("#00b4d8", "white")}
        >
          ➕ Agregar Mantenimiento
        </button>
      </div>

      {/* LISTADO */}
      {mantenimientos.length === 0 ? (
        <p style={{ textAlign: "center", color: "#333" }}>No hay mantenimientos registrados.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mantenimientos.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/mantenimientos/${m.id}`)}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                padding: "1rem 1.5rem",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
            >
              <h3 style={{ color: "#0077b6", marginBottom: "0.3rem" }}>
                {m.tipo === "Preventivo" ? "🧰" : "⚙️"} {m.tipo}
              </h3>
              <p><b>Fecha:</b> {m.fecha}</p>
              <p><b>Agente:</b> {m.agente || "—"}</p>
              <p><b>Equipo:</b> {m.equipo_nombre || "No especificado"}</p>
            </div>
          ))}
        </div>
      )}
      <FloatingButton destino="/mantenimientos/nuevo" tooltip="Agregar mantenimiento" />

    </div>
  );
}

function btn(bg, color) {
  return {
    backgroundColor: bg,
    color,
    border: "none",
    borderRadius: "8px",
    padding: "0.8rem 1.5rem",
    cursor: "pointer",
    fontWeight: "bold",
  };
}

export default MantenimientosPage;
