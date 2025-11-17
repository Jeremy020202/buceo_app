// Página principal – Dashboard + navegación original
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";

function Home() {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [resumen, setResumen] = useState({
    total_equipos: "—",
    activos: "—",
    inactivos: "—",
    equipos_en_mantenimiento: "—",
    total_mantenimientos: "—",
    mantenimientos_mes_actual: "—",
  });

  const [data, setData] = useState([]);
  const [sinMantenimiento, setSinMantenimiento] = useState([]);
  const [proximos, setProximos] = useState([]);


  // --- CARGAR DATOS DEL BACKEND ---
  useEffect(() => {
    // 🔹 Resumen de equipos
    fetch("http://localhost:5000/dashboard/equipos-resumen")
      .then((res) => res.json())
      .then((json) =>
        setResumen((prev) => ({
          ...prev,
          total_equipos: json.total ?? "—",
          activos: json.activos ?? "—",
          inactivos: json.inactivos ?? "—",
          equipos_en_mantenimiento: json.equipos_en_mantenimiento ?? "—",
        }))
      )
      .catch((e) => console.error("Error al cargar resumen equipos:", e));

    // 🔹 Resumen de mantenimientos
    fetch("http://localhost:5000/dashboard/mantenimientos-resumen")
      .then((res) => res.json())
      .then((json) =>
        setResumen((prev) => ({
          ...prev,
          total_mantenimientos: json.total ?? "—",
          mantenimientos_mes_actual: json.este_mes ?? "—",
        }))
      )
      .catch((e) => console.error("Error al cargar resumen mantenimientos:", e));

    // 🔹 Gráfica mensual
    fetch("http://localhost:5000/dashboard/mantenimientos-historial")
      .then((res) => res.json())
      .then((json) =>
        setData(
          json.map((item) => ({
            mes: item.mes,
            mantenimientos: item.cantidad,
          }))
        )
      )
      .catch((e) => console.error("Error al cargar gráfica:", e));
    // 🔹 Equipos sin mantenimiento
    fetch("http://localhost:5000/dashboard/equipos-sin-mantenimiento")
      .then((res) => res.json())
      .then((json) => setSinMantenimiento(json))
      .catch((e) => console.error("Error al cargar equipos sin mantenimiento:", e));
      
    // 🔹 Próximos mantenimientos
    fetch("http://localhost:5000/dashboard/proximos-mantenimientos")
      .then((res) => res.json())
      .then((json) => setProximos(json))
      .catch((e) => console.error("Error al cargar próximos mantenimientos:", e));
  }, []);



  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        background: "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", color: "#023e8a", marginTop: "1rem" }}>
        Dashboard General
      </h1>

      {/* ======== TARJETAS RESUMEN ======== */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        {[
          { titulo: "Equipos Totales", valor: resumen.total_equipos },
          { titulo: "Equipos Activos", valor: resumen.activos },
          { titulo: "Equipos Inactivos", valor: resumen.inactivos },
          { titulo: "Equipos en mantenimiento", valor: resumen.equipos_en_mantenimiento },
          { titulo: "Mantenimientos Totales", valor: resumen.total_mantenimientos },
          { titulo: "Mantenimientos este mes", valor: resumen.mantenimientos_mes_actual },
        ].map((card, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              width: "250px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", color: "#555" }}>{card.titulo}</h3>
            <p style={{ fontSize: "2rem", color: "#0077b6", fontWeight: "bold" }}>
              {card.valor}
            </p>
          </div>
        ))}
      </div>

      {/* ======== GRÁFICA (RECHARTS) ======== */}
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "15px",
          width: "100%",
          maxWidth: "900px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#023e8a", textAlign: "center" }}>
          Mantenimientos por mes
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="mantenimientos" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* ======== TABLA — EQUIPOS SIN MANTENIMIENTO ======== */}
<div
  style={{
    background: "white",
    padding: "2rem",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "900px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  }}
>
  <h2 style={{ marginBottom: "1rem", color: "#023e8a", textAlign: "center" }}>
    Equipos sin mantenimiento registrado
  </h2>

  {sinMantenimiento.length === 0 ? (
    <p style={{ textAlign: "center", color: "#666" }}>
      ✔ Todos los equipos tienen al menos un mantenimiento.
    </p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#e9ecef" }}>
          <th style={thStyle}>Nombre</th>
          <th style={thStyle}>Código</th>
        </tr>
      </thead>
      <tbody>
        {sinMantenimiento.map((eq) => (
          <tr 
            key={eq.id} 
            onClick={() => navigate(`/equipos/${eq.id}`)}
            style={{
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            <td style={tdStyle}>{eq.nombre}</td>
            <td style={tdStyle}>{eq.codigo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>
{/* ======== TABLA — PRÓXIMOS 5 MANTENIMIENTOS ======== */}
<div
  style={{
    background: "white",
    padding: "2rem",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "900px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  }}
>
  <h2 style={{ marginBottom: "1rem", color: "#023e8a", textAlign: "center" }}>
    Próximos mantenimientos 
  </h2>

  {proximos.length === 0 ? (
    <p style={{ textAlign: "center", color: "#666" }}>
      ✔ No hay mantenimientos próximos programados.
    </p>
  ) : (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#e9ecef" }}>
          <th style={thStyle}>Nombre</th>
          <th style={thStyle}>Tipo</th>
          <th style={thStyle}>Fecha próxima</th>
        </tr>
      </thead>
      <tbody>
        {proximos.map((eq) => (
          <tr
            key={eq.id}
            onClick={() => navigate(`/equipos/${eq.id}`)}
            style={{
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f3f5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            <td style={tdStyle}>{eq.nombre}</td>
            <td style={tdStyle}>{eq.tipo}</td>
            <td style={tdStyle}>{eq.proximo_mantenimiento}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>



      {/* ======== BOTONES ORIGINALES ======== */}
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <button
          onClick={() => navigate("/equipos")}
          style={botonPrincipal}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🧰 Gestionar Equipos
        </button>

        <button
          onClick={() => navigate("/mantenimientos")}
          style={botonPrincipal}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🔧 Gestionar Mantenimientos
        </button>
      </div>
    </div>
  );
}

const botonPrincipal = {
  backgroundColor: "white",
  color: "#0077b6",
  border: "none",
  borderRadius: "12px",
  padding: "1.5rem 3rem",
  fontSize: "1.2rem",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  transition: "transform 0.2s",
};
const thStyle = {
  padding: "10px",
  fontWeight: "bold",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
};

export default Home;
