// Formulario para agregar un nuevo mantenimiento
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MantenimientoForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({
    tipo: "",
    fecha: "",
    agente: "",
    descripcion: "",
    equipo_id: "",
  });

  // Detectar si viene desde un equipo específico
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const equipoId = params.get("equipo_id");
    if (equipoId) {
      setForm((prev) => ({ ...prev, equipo_id: equipoId }));
    }
  }, [location.search]);

  // Cargar equipos disponibles
  useEffect(() => {
    api
      .get("/equipos")
      .then((res) => setEquipos(res.data))
      .catch(() => toast.error("❌ Error al cargar los equipos"));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/mantenimientos", form);
      toast.success("✅ Mantenimiento registrado correctamente");
      setTimeout(() => navigate("/mantenimientos"), 2000);
    } catch {
      toast.error("❌ Error al guardar mantenimiento");
    }
  };

  // 🎨 Estilos base iguales al de EquipoForm
  const inputStyle = {
    width: "98%",
    alignSelf: "center",
    padding: "0.8rem 1rem",
    border: "1px solid #90e0ef",
    borderRadius: "8px",
    fontSize: "1rem",
    color: "#03045e",
    backgroundColor: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  // 💡 Estilo especial para el campo de fecha
  const dateInputStyle = {
    ...inputStyle,
    WebkitAppearance: "none",
    MozAppearance: "textfield",
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#0077b6",
    fontSize: "0.95rem",
  };

  const buttonBase = (bg, color) => ({
    backgroundColor: bg,
    color,
    padding: "0.8rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "transform 0.2s, background-color 0.2s",
  });

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ToastContainer position="bottom-right" autoClose={2500} />

      <h2
        style={{
          textAlign: "center",
          background: "linear-gradient(90deg, #0077b6, #00b4d8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2rem",
          marginBottom: "1.5rem",
        }}
      >
        Agregar nuevo mantenimiento
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem",
        }}
      >
        {/* Tipo de mantenimiento */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="tipo" style={labelStyle}>Tipo</label>
          <select
            name="tipo"
            value={form.tipo}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccionar tipo</option>
            <option value="Preventivo">Preventivo</option>
            <option value="Correctivo">Correctivo</option>
          </select>
        </div>

        {/* Fecha */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="fecha" style={labelStyle}>Fecha</label>
          <input
            type="date"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            style={dateInputStyle}
          />
        </div>

        {/* Agente */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="agente" style={labelStyle}>Agente</label>
          <input
            type="text"
            name="agente"
            value={form.agente}
            onChange={handleChange}
            placeholder="Nombre del agente"
            style={inputStyle}
          />
        </div>

        {/* Descripción */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="descripcion" style={labelStyle}>Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Descripción del mantenimiento"
            style={{ ...inputStyle, height: "100px", resize: "none" }}
          ></textarea>
        </div>

        {/* Equipo asociado */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="equipo_id" style={labelStyle}>Equipo asociado</label>
          <select
            name="equipo_id"
            value={form.equipo_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccionar equipo</option>
            {equipos.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nombre} — {eq.marca}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
          <button
            type="submit"
            style={buttonBase("#0077b6", "white")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            💾 Guardar mantenimiento
          </button>

          <button
            type="button"
            onClick={() => navigate("/mantenimientos")}
            style={buttonBase("#90e0ef", "#03045e")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🔙 Cancelar
          </button>
        </div>
      </form>

      {/* 🌟 Fix visual del ícono del calendario */}
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(40%) sepia(80%) saturate(400%) hue-rotate(170deg);
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}

export default MantenimientoForm;
