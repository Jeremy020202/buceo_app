//Pagina principal de mantenimientos con filtros y navegación
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingButton from "../components/FloatingButton";

// Componente principal de la página de mantenimientos
function MantenimientosPage() {
  // Estado para mantenimientos, búsqueda y filtro por tipo
  const [mantenimientos, setMantenimientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const navigate = useNavigate();
  // Cargar mantenimientos desde la API
  useEffect(() => {
    api
      .get("/mantenimientos")
      .then((res) => setMantenimientos(res.data))
      .catch(() => toast.error("❌ Error al cargar mantenimientos"));
  }, []);

  // Filtro combinado de búsqueda y tipo
  const mantenimientosFiltrados = mantenimientos.filter((m) => {
    const coincideTexto =
      [m.tipo, m.agente, m.equipo_nombre]
        .join(" ")
        .toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideTipo =
      tipoFiltro === "Todos" || m.tipo === tipoFiltro;

    return coincideTexto && coincideTipo;
  });

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
      }}
    >
      <ToastContainer position="bottom-right" autoClose={2000} />

      <h1
        style={{
          textAlign: "center",
          color: "#0077b6",
          marginBottom: "1rem",
        }}
      >
        Historial de Mantenimientos
      </h1>

      {/* 🔹 Buscador + Filtro */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar por tipo, agente o equipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            padding: "0.8rem 1rem",
            width: "50%",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={{
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        >
          <option value="Todos">Todos</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
        </select>
      </div>

      {/* 🔹 Botones de navegación */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "1.5rem",
          gap: "1rem",
        }}
      >
        <button onClick={() => navigate("/inicio")} style={btn("#90e0ef", "#03045e")}>
          ⬅️ Volver al inicio
        </button>
        <button onClick={() => navigate("/equipos")} style={btn("#0077b6", "white")}>
          ⚙️ Ir a Equipos
        </button>
        <button onClick={() => navigate("/mantenimientos/nuevo")} style={btn("#00b4d8", "white")}>
          ➕ Agregar Mantenimiento
        </button>
      </div>

      {/* 🔹 Listado */}
      {mantenimientosFiltrados.length === 0 ? (
        <p style={{ textAlign: "center", color: "#333" }}>
          {busqueda || tipoFiltro !== "Todos"
            ? "No se encontraron resultados para tu búsqueda."
            : "No hay mantenimientos registrados."}
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mantenimientosFiltrados.map((m) => (
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
// Estilos reutilizables
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
