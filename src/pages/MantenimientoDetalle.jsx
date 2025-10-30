//Vista detallada y edición de un mantenimiento específico
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MantenimientoDetalle() {
  // Obtener ID del mantenimiento desde la URL
  const { id } = useParams();
  const navigate = useNavigate();
  // Estado para el mantenimiento, modo edición y formulario
  const [mantenimiento, setMantenimiento] = useState(null);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});
// Cargar detalles del mantenimiento
  useEffect(() => {
    api.get(`/mantenimientos/${id}`)
      .then(res => {
        setMantenimiento(res.data);
        setFormData(res.data);
      })
      .catch(() => toast.error("❌ Error al cargar mantenimiento"));
  }, [id]);
// Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
// Guardar cambios realizados
  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await api.put(`/mantenimientos/${id}`, formData);
      setMantenimiento(formData);
      setEditando(false);
      toast.success("✅ Mantenimiento actualizado correctamente");
    } catch {
      toast.error("❌ Error al guardar cambios");
    } finally {
      setGuardando(false);
    }
  };
// Eliminar el mantenimiento
  const handleEliminar = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este mantenimiento?")) return;
    try {
      await api.delete(`/mantenimientos/${id}`);
      toast.success("🗑️ Mantenimiento eliminado");
      setTimeout(() => navigate("/mantenimientos"), 1500);
    } catch {
      toast.error("❌ Error al eliminar mantenimiento");
    }
  };
// Mostrar carga si no hay mantenimiento
  if (!mantenimiento) return <p style={{ textAlign: "center" }}>Cargando...</p>;
// Color según tipo de mantenimiento
  const tipoColor = mantenimiento.tipo === "Preventivo" ? "#0077b6" : "#d00000";

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" autoClose={2500} />
      {/* Botón para volver a la lista de mantenimientos */}
      <button
        onClick={() => navigate("/mantenimientos")}
        style={btn("#90e0ef", "#03045e")}
      >
        ⬅️ Volver
      </button>
      {/* Detalles del mantenimiento */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: tipoColor }}>
          {mantenimiento.tipo === "Preventivo" ? "🧰" : "⚙️"} {mantenimiento.tipo}
        </h2>

        {editando ? (
          <>
            {/* Campo: Tipo */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Tipo:</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
              </select>
            </div>

            {/* Campo: Fecha */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Fecha:</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Campo: Agente */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Agente:</label>
              <input
                name="agente"
                value={formData.agente || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Campo: Descripción */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Descripción:</label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleChange}
                style={{ ...inputStyle, height: "80px" }}
              ></textarea>
            </div>

            {/* Campo: Equipo asociado (bloqueado) */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Equipo asociado:</label>
              <select
                name="equipo_id"
                value={formData.equipo_id}
                disabled
                style={{ ...inputStyle, backgroundColor: "#eee", cursor: "not-allowed" }}
              >
                <option value={formData.equipo_id}>
                  {formData.equipo_nombre || `ID: ${formData.equipo_id}`}
                </option>
              </select>
            </div>

            <button
              onClick={handleGuardar}
              style={btn("#00b4d8", "white")}
              disabled={guardando}
            >
              {guardando ? "💾 Guardando..." : "💾 Guardar cambios"}
            </button>
          </>
        ) : (
          <>
            <p><b>Fecha:</b> {mantenimiento.fecha || "—"}</p>
            <p><b>Agente:</b> {mantenimiento.agente || "—"}</p>
            <p><b>Descripción:</b> {mantenimiento.descripcion || "Sin descripción"}</p>
            <p><b>Equipo asociado:</b> {mantenimiento.equipo_nombre || `ID ${mantenimiento.equipo_id}`}</p>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button onClick={() => setEditando(true)} style={btn("#0077b6", "white")}>
                ✏️ Editar
              </button>
              <button onClick={handleEliminar} style={btn("#d00000", "white")}>
                🗑️ Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
// Estilos reutilizables
const fieldContainer = { marginBottom: "1rem", textAlign: "left" };
const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "0.3rem" };
const inputStyle = { width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #ccc" };
const btn = (bg, color) => ({
  backgroundColor: bg,
  color,
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.2rem",
  cursor: "pointer",
  fontWeight: "bold",
});

export default MantenimientoDetalle;
