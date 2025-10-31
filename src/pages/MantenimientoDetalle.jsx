// Vista detallada y edición de un mantenimiento específico
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MantenimientoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mantenimiento, setMantenimiento] = useState(null);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});

  // Cargar detalles del mantenimiento
  useEffect(() => {
    api
      .get(`/mantenimientos/${id}`)
      .then((res) => {
        setMantenimiento(res.data);
        setFormData(res.data);
      })
      .catch(() => toast.error("❌ Error al cargar mantenimiento"));
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

  if (!mantenimiento) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
      }}
    >
      <ToastContainer position="bottom-right" autoClose={2500} />

      <button onClick={() => navigate("/mantenimientos")} style={btn("#90e0ef", "#03045e")}>
        ⬅️ Volver
      </button>

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {/* ✅ Emoji con color natural + título con degradado */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "2rem" }}>
            {mantenimiento.tipo === "Preventivo" ? "🧰" : "⚙️"}
          </span>
          <h2
            style={{
              background: "linear-gradient(90deg, #0077b6, #00b4d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: "2rem",
              margin: 0,
            }}
          >
            {mantenimiento.tipo}
          </h2>
        </div>

        {editando ? (
          <>
            <div style={fieldContainer}>
              <label style={labelStyle}>Tipo</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} style={inputStyle}>
                <option value="Preventivo">Preventivo</option>
                <option value="Correctivo">Correctivo</option>
              </select>
            </div>

            <div style={fieldContainer}>
              <label style={labelStyle}>Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldContainer}>
              <label style={labelStyle}>Agente</label>
              <input
                name="agente"
                value={formData.agente || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={fieldContainer}>
              <label style={labelStyle}>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleChange}
                style={{ ...inputStyle, height: "100px", resize: "none" }}
              ></textarea>
            </div>

            <div style={fieldContainer}>
              <label style={labelStyle}>Equipo asociado</label>
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

            <button onClick={handleGuardar} style={btn("#00b4d8", "white")} disabled={guardando}>
              {guardando ? "💾 Guardando..." : "💾 Guardar cambios"}
            </button>
          </>
        ) : (
          <>
            <p>
              <b>Fecha:</b> {mantenimiento.fecha || "—"}
            </p>
            <p>
              <b>Agente:</b> {mantenimiento.agente || "—"}
            </p>
            <p>
              <b>Descripción:</b> {mantenimiento.descripcion || "Sin descripción"}
            </p>
            <p>
              <b>Equipo asociado:</b> {mantenimiento.equipo_nombre || `ID ${mantenimiento.equipo_id}`}
            </p>

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

// 🎨 Estilos
const fieldContainer = { marginBottom: "1rem", textAlign: "left" };
const labelStyle = { display: "block", fontWeight: "bold", marginBottom: "0.3rem", color: "#0077b6" };
const inputStyle = {
  width: "98%",
  padding: "0.8rem 1rem",
  borderRadius: "8px",
  border: "1px solid #90e0ef",
  fontSize: "1rem",
  color: "#03045e",
  backgroundColor: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const btn = (bg, color) => ({
  backgroundColor: bg,
  color,
  border: "none",
  borderRadius: "8px",
  padding: "0.8rem 1.2rem",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  transition: "transform 0.2s, background-color 0.2s",
});

export default MantenimientoDetalle;
