import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EquipoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    api.get(`/equipos/${id}`)
      .then((res) => {
        setEquipo(res.data);
        setFormData(res.data);
      })
      .catch(() => toast.error("❌ Error al cargar el equipo"));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await api.put(`/equipos/${id}`, formData);
      setEquipo(formData);
      setEditando(false);
      toast.success("✅ Equipo actualizado correctamente");
    } catch {
      toast.error("❌ Error al guardar cambios");
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este equipo?")) return;
    try {
      await api.delete(`/equipos/${id}`);
      toast.success("🗑️ Equipo eliminado");
      setTimeout(() => navigate("/equipos"), 1500);
    } catch {
      toast.error("❌ Error al eliminar el equipo");
    }
  };

  if (!equipo) return <p style={{ textAlign: "center" }}>Cargando...</p>;

  return (
    <div style={{ padding: "2rem", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar={false} />

      <button
        onClick={() => navigate("/equipos")}
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
          maxWidth: "600px",
          margin: "0 auto",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        {equipo && (
          <img
            src={
              equipo.imagen_url && equipo.imagen_url.trim() !== ""
                ? equipo.imagen_url
                : "https://via.placeholder.com/400x250?text=Sin+Imagen"
            }
            alt={equipo.nombre || "Equipo sin nombre"}
            style={{
              width: "100%",
              height: "250px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "1rem",
            }}
          />
        )}

        {editando ? (
          <>
            {/* Campo: Nombre */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Nombre:</label>
              <input
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Campo: Marca */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Marca:</label>
              <input
                name="marca"
                value={formData.marca || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Campo: Modelo */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Modelo:</label>
              <input
                name="modelo"
                value={formData.modelo || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Campo: URL de imagen */}
            <div style={fieldContainer}>
              <label style={labelStyle}>URL de la imagen:</label>
              <input
                name="imagen_url"
                value={formData.imagen_url || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            {/* Campo: Estado */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Estado:</label>
              <select
                name="estado"
                value={formData.estado || ""}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Activo">Activo</option>
                <option value="En mantenimiento">En mantenimiento</option>
                <option value="Dañado">Dañado</option>
              </select>
            </div>

            {/* Campo: Fecha de compra */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Fecha de compra:</label>
              <input
                name="fecha_compra"
                value={formData.fecha_compra || ""}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                style={inputStyle}
              />
            </div>

            {/* Campo: Periodo de mantenimiento */}
            <div style={fieldContainer}>
              <label style={labelStyle}>Periodo de mantenimiento:</label>
              <input
                name="periodo_mantenimiento"
                value={formData.periodo_mantenimiento || ""}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleGuardar}
              style={btn("#00b4d8", "white")}
            >
              💾 Guardar cambios
            </button>
          </>
        ) : (
          <>
            <h2 style={{ color: "#0077b6" }}>{equipo.nombre}</h2>
            <p><b>Marca:</b> {equipo.marca}</p>
            <p><b>Modelo:</b> {equipo.modelo}</p>
            <p><b>Estado:</b> {equipo.estado}</p>
            <p><b>Fecha de compra:</b> {equipo.fecha_compra}</p>
            <p><b>Periodo de mantenimiento:</b> {equipo.periodo_mantenimiento}</p>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                onClick={() => setEditando(true)}
                style={btn("#0077b6", "white")}
              >
                ✏️ Editar
              </button>
              <button
                onClick={handleEliminar}
                style={btn("#d00000", "white")}
              >
                🗑️ Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Estilos base reutilizables ---
const fieldContainer = {
  marginBottom: "1rem",
  textAlign: "left",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "0.3rem",
};

const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = (bg, color) => ({
  backgroundColor: bg,
  color,
  border: "none",
  borderRadius: "8px",
  padding: "0.6rem 1.2rem",
  cursor: "pointer",
  fontWeight: "bold",
});

export default EquipoDetalle;
