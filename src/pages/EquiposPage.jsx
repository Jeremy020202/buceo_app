//Pagina principal de equipos con filtros y navegación
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/FloatingButton";

function EquiposPage() {
  // 🧰 Estado para equipos, búsqueda y filtros
  const [equipos, setEquipos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [marcaFiltro, setMarcaFiltro] = useState("Todas");
  const navigate = useNavigate();
// 🧩 Cargar equipos desde la API
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/equipos")
      .then((res) => setEquipos(res.data))
      .catch(() => console.error("Error al cargar equipos"));
  }, []);

  // 🔹 Marcas únicas para el filtro
  const marcasDisponibles = ["Todas", ...new Set(equipos.map((eq) => eq.marca))];

  // 🔍 Filtro combinado
  const equiposFiltrados = equipos.filter((eq) => {
    const coincideBusqueda = [eq.nombre, eq.marca, eq.modelo]
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideEstado =
      estadoFiltro === "Todos" || eq.estado === estadoFiltro;
    const coincideMarca =
      marcaFiltro === "Todas" || eq.marca === marcaFiltro;
    return coincideBusqueda && coincideEstado && coincideMarca;
  });
// 🧱 Renderizado de la página
  return (
    <div
      style={{
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#f0f8ff",
        position: "relative",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#0077b6", marginBottom: "1.5rem" }}>
        Inventario de Equipos
      </h1>

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
          style={{
            padding: "0.8rem 1rem",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />

        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          style={{
            padding: "0.7rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Activo">Activo</option>
          <option value="En mantenimiento">En mantenimiento</option>
          <option value="Dañado">Dañado</option>
        </select>

        <select
          value={marcaFiltro}
          onChange={(e) => setMarcaFiltro(e.target.value)}
          style={{
            padding: "0.7rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
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
          style={{
            backgroundColor: "#90e0ef",
            border: "none",
            borderRadius: "8px",
            padding: "0.8rem 1.5rem",
            cursor: "pointer",
            color: "#03045e",
            fontWeight: "bold",
          }}
        >
          ⬅️ Volver al inicio
        </button>

        <button
          onClick={() => navigate("/mantenimientos")}
          style={{
            backgroundColor: "#0077b6",
            border: "none",
            borderRadius: "8px",
            padding: "0.8rem 1.5rem",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
        >
          🔧 Ir a Mantenimientos
        </button>

        <button
          onClick={() => navigate("/equipos/nuevo")}
          style={{
            backgroundColor: "#00b4d8",
            border: "none",
            borderRadius: "8px",
            padding: "0.8rem 1.5rem",
            cursor: "pointer",
            color: "white",
            fontWeight: "bold",
          }}
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
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={
                  eq.imagen_url ||
                  "https://via.placeholder.com/400x250?text=Sin+Imagen"
                }
                alt={eq.nombre}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "1rem" }}>
                <h3 style={{ color: "#0077b6" }}>{eq.nombre}</h3>
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
