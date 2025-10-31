// Página principal de mantenimientos con filtros y navegación
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FloatingButton from "../components/FloatingButton";

function MantenimientosPage() {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const navigate = useNavigate();

  // 🧩 Cargar mantenimientos desde la API
  useEffect(() => {
    api
      .get("/mantenimientos")
      .then((res) => setMantenimientos(res.data))
      .catch(() => toast.error("❌ Error al cargar mantenimientos"));
  }, []);

  // 🔍 Filtro combinado
  const mantenimientosFiltrados = mantenimientos.filter((m) => {
    const coincideTexto = [m.tipo, m.agente, m.equipo_nombre]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideTipo = tipoFiltro === "Todos" || m.tipo === tipoFiltro;
    return coincideTexto && coincideTipo;
  });

  // 🎨 Estilos base reutilizables
  const inputBase = {
    padding: "0.8rem 1rem",
    borderRadius: "8px",
    border: "1px solid #90e0ef",
    backgroundColor: "white",
    color: "#03045e",
    fontSize: "1rem",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "all 0.2s ease",
  };

  const buttonBase = (bg, color) => ({
    backgroundColor: bg,
    color,
    border: "none",
    borderRadius: "8px",
    padding: "0.8rem 1.5rem",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s, transform 0.15s",
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

      {/* 🔹 Título principal con degradado */}
      <h1
        style={{
          textAlign: "center",
          background: "linear-gradient(90deg, #0077b6, #00b4d8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          fontSize: "2rem",
          marginBottom: "0.3rem",
        }}
      >
        Historial de Mantenimientos
      </h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "1.5rem" }}>
        Consulta, gestiona y registra mantenimientos fácilmente
      </p>

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
          style={{ ...inputBase, width: "320px" }}
        />

        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          style={inputBase}
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
        <button
          onClick={() => navigate("/inicio")}
          style={buttonBase("#90e0ef", "#03045e")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ⬅️ Volver al inicio
        </button>

        <button
          onClick={() => navigate("/equipos")}
          style={buttonBase("#0077b6", "white")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ⚙️ Ir a Equipos
        </button>

        <button
          onClick={() => navigate("/mantenimientos/nuevo")}
          style={buttonBase("#00b4d8", "white")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ➕ Agregar Mantenimiento
        </button>
      </div>

      {/* 🔹 Listado de mantenimientos */}
      {mantenimientosFiltrados.length === 0 ? (
        <p style={{ textAlign: "center", color: "#333" }}>
          {busqueda || tipoFiltro !== "Todos"
            ? "No se encontraron resultados para tu búsqueda."
            : "No hay mantenimientos registrados."}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.2rem",
          }}
        >
          {mantenimientosFiltrados.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/mantenimientos/${m.id}`)}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                border: "1px solid #e0f2ff",
                padding: "1rem 1.5rem",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0,0,0,0.1)";
              }}
            >
              <h3
                style={{
                  color: m.tipo === "Preventivo" ? "#0077b6" : "#d00000",
                  marginBottom: "0.5rem",
                }}
              >
                {m.tipo === "Preventivo" ? "🧰" : "⚙️"} {m.tipo}
              </h3>
              <p><b>Fecha:</b> {m.fecha}</p>
              <p><b>Agente:</b> {m.agente || "—"}</p>
              <p><b>Equipo:</b> {m.equipo_nombre || "No especificado"}</p>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Botón flotante */}
      <FloatingButton onClick={() => navigate("/mantenimientos/nuevo")} />
    </div>
  );
}

export default MantenimientosPage;
