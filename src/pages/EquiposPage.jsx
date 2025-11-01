// Pagina principal de equipos con filtros y navegación
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

function EquiposPage() {
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [marcaFiltro, setMarcaFiltro] = useState("Todas");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/equipos")
      .then((res) => setEquipos(res.data))
      .catch(() => console.error("Error al cargar equipos"));
  }, []);

  const marcasDisponibles = ["Todas", ...new Set(equipos.map((eq) => eq.marca))];

  const equiposFiltrados = equipos.filter((eq) => {
    const coincideBusqueda = [eq.nombre, eq.marca, eq.modelo]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideEstado =
      estadoFiltro === "Todos" || eq.estado === estadoFiltro;
    const coincideMarca = marcaFiltro === "Todas" || eq.marca === marcaFiltro;
    return coincideBusqueda && coincideEstado && coincideMarca;
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
        minHeight: "100vh",
        backgroundColor: "#f0f8ff",
        position: "relative",
      }}
    >
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
        Inventario de Equipos
      </h1>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "1.5rem" }}>
        Administra y supervisa todos los equipos de buceo de forma sencilla
      </p>

      {/* 🔹 Filtros y búsqueda */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Buscar por nombre, marca o modelo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ ...inputBase, width: "300px" }}
        />

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={inputBase}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="En mantenimiento">En mantenimiento</option>
          <option value="Dañado">Dañado</option>
        </select>

        <select
          value={marcaFiltro}
          onChange={(e) => setMarcaFiltro(e.target.value)}
          style={inputBase}
        >
          {marcasDisponibles.map((m, i) => (
            <option key={i} value={m}>
              {m === "Todas" ? "Todas las marcas" : m}
            </option>
          ))}
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
        >
          ⬅️ Volver al inicio
        </button>

        <button
          onClick={() => navigate("/mantenimientos")}
          style={buttonBase("#0077b6", "white")}
        >
          🔧 Ir a Mantenimientos
        </button>

        <button
          onClick={() => navigate("/equipos/nuevo")}
          style={buttonBase("#00b4d8", "white")}
        >
          ➕ Agregar Equipo
        </button>
      </div>

      {/* 🔹 Tarjetas de equipos */}
      {equiposFiltrados.length === 0 ? (
        <p style={{ textAlign: "center", color: "#333" }}>
          {busqueda || estadoFiltro !== "Todos" || marcaFiltro !== "Todas"
            ? "No se encontraron resultados para tu búsqueda o filtros."
            : "No hay equipos registrados."}
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            padding: "1rem",
          }}
        >
          {equiposFiltrados.map((eq) => (
            <div
              key={eq.id}
              onClick={() => navigate(`/equipos/${eq.id}`)}
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                border: "1px solid #e0f2ff",
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "pointer",
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
              {/* 🖼️ Mostrar imagen solo si existe */}
              {eq.imagen_url && eq.imagen_url.trim() !== "" && (
                <img
                  src={eq.imagen_url}
                  alt={eq.nombre}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                />
              )}
              <div style={{ padding: "1rem" }}>
                <h3 style={{ color: "#0077b6", marginBottom: "0.3rem" }}>
                  {eq.nombre}
                </h3>
                <p style={{ margin: "0.2rem 0" }}>
                  <b>Marca:</b> {eq.marca}
                </p>
                <p style={{ margin: "0.2rem 0" }}>
                  <b>Modelo:</b> {eq.modelo}
                </p>
                <p style={{ margin: "0.2rem 0" }}>
                  <b>Estado:</b> {eq.estado}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <FloatingButton onClick={() => navigate("/equipos/nuevo")} />
    </div>
  );
}

export default EquiposPage;
