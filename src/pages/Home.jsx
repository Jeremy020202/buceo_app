import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0077b6, #90e0ef)",
        color: "white",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>
        Aplicación de Gestión y Mantenimiento de Equipos de Buceo
      </h1>
      <p style={{ fontSize: "1.3rem", marginBottom: "3rem", opacity: 0.9 }}>
        Administra tus equipos, planifica mantenimientos y lleva un control eficiente.
      </p>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => navigate("/equipos")}
          style={{
            backgroundColor: "white",
            color: "#0077b6",
            border: "none",
            borderRadius: "12px",
            padding: "1.5rem 3rem",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🧰 Gestionar Equipos
        </button>

        <button
          onClick={() => navigate("/mantenimientos")}
          style={{
            backgroundColor: "white",
            color: "#0077b6",
            border: "none",
            borderRadius: "12px",
            padding: "1.5rem 3rem",
            fontSize: "1.2rem",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🔧 Gestionar Mantenimientos
        </button>
      </div>
    </div>
  );
}

export default Home;
