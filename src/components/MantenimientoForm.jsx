//formulario para agregar un nuevo mantenimiento
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Componente del formulario de mantenimiento
function MantenimientoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  // Estado para la lista de equipos y datos del formulario
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState({
    tipo: "",
    fecha: "",
    agente: "",
    descripcion: "",
    equipo_id: "",
  });

  // esto deberia poner el equipo si viene de la pantalla de un equipo
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const equipoId = params.get("equipo_id");
    if (equipoId) {
      setForm((prev) => ({ ...prev, equipo_id: equipoId }));
    }
  }, [location.search]);

  // Cargar equipos para el selector
  useEffect(() => {
    api
      .get("/equipos")
      .then((res) => setEquipos(res.data))
      .catch(() => toast.error("❌ Error al cargar los equipos"));
  }, []);
// Manejar cambios en el formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
// Enviar datos del formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/mantenimientos", form);
      toast.success("✅ Mantenimiento registrado correctamente");
      setTimeout(() => navigate("/mantenimientos"), 2000); //como un redirect
    } catch {
      toast.error("❌ Error al guardar mantenimiento");
    }
  };

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" autoClose={2500} />
      <h2 style={{ textAlign: "center", color: "#0077b6" }}>Agregar Mantenimiento</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <select name="tipo" value={form.tipo} onChange={handleChange} required>
          <option value="">Seleccionar tipo</option>
          <option value="Preventivo">Preventivo</option>
          <option value="Correctivo">Correctivo</option>
        </select>

        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

        <input
          type="text"
          name="agente"
          placeholder="Nombre del agente"
          value={form.agente}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción del mantenimiento"
          value={form.descripcion}
          onChange={handleChange}
          style={{ height: "80px" }}
        ></textarea>

        <select name="equipo_id" value={form.equipo_id} onChange={handleChange} required>
          <option value="">Seleccionar equipo</option>
          {equipos.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.nombre} — {eq.marca}
            </option>
          ))}
        </select>

        <button
          type="submit"
          style={{
            backgroundColor: "#0077b6",
            color: "white",
            padding: "0.8rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          💾 Guardar mantenimiento
        </button>

        <button
          type="button"
          onClick={() => navigate("/mantenimientos")}
          style={{
            backgroundColor: "#90e0ef",
            color: "#03045e",
            padding: "0.8rem",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🔙 Cancelar
        </button>
      </form>
    </div>
  );
}

export default MantenimientoForm;
