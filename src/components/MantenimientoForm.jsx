/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MantenimientoForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tipo: "",
    fecha: "",
    agente: "",
    descripcion: "",
    equipo_id: "",
  });
  const [equipos, setEquipos] = useState([]);

  useEffect(() => {
    api.get("/equipos")
      .then((res) => setEquipos(res.data))
      .catch(() => toast.error("❌ Error al cargar equipos disponibles"));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/mantenimientos", formData);
      toast.success("✅ Mantenimiento agregado correctamente");
      setTimeout(() => navigate("/mantenimientos"), 1500);
    } catch (error) {
      toast.error("❌ Error al agregar mantenimiento");
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" autoClose={2500} />

      <button
        onClick={() => navigate("/mantenimientos")}
        style={{
          backgroundColor: "#90e0ef",
          border: "none",
          borderRadius: "8px",
          padding: "0.6rem 1.2rem",
          cursor: "pointer",
          color: "#03045e",
          fontWeight: "bold",
          marginBottom: "1.5rem",
        }}
      >
        ⬅️ Volver
      </button>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxWidth: "500px",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <h2 style={{ color: "#0077b6", textAlign: "center", marginBottom: "1rem" }}>
          ➕ Registrar nuevo mantenimiento
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Tipo:</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccione un tipo</option>
            <option value="Preventivo">Preventivo 🧰</option>
            <option value="Correctivo">Correctivo ⚙️</option>
          </select>

          <label>Fecha:</label>
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label>Agente:</label>
          <input
            type="text"
            name="agente"
            value={formData.agente}
            onChange={handleChange}
            placeholder="Nombre del técnico"
            style={inputStyle}
          />

          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Detalles del mantenimiento"
            style={{ ...inputStyle, minHeight: "80px" }}
          />

          <label>Equipo asociado:</label>
          <select
            name="equipo_id"
            value={formData.equipo_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Seleccione un equipo</option>
            {equipos.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nombre} ({eq.marca})
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: "#0077b6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.8rem 1.5rem",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
              marginTop: "1rem",
            }}
          >
            💾 Guardar mantenimiento
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  margin: "0.4rem 0 1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

export default MantenimientoForm;
