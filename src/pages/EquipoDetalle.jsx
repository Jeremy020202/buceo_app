//Vista detallada de un equipo, permite ver, editar y eliminar el equipo, asi como ver y agregar mantenimientos asociados
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente principal que consigue id del equipo desde la URL y maneja su estado
function EquipoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipo, setEquipo] = useState(null);
  const [mantenimientos, setMantenimientos] = useState([]); 
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // consigue los datos del equipo
    api
      .get(`/equipos/${id}`)
      .then((res) => {
        setEquipo(res.data);
        setFormData(res.data);
      })
      .catch(() => toast.error("❌ Error al cargar el equipo"));

    // consigue los mantenimientos asociados al equipo
    api
      .get(`/mantenimientos?equipo_id=${id}`)
      .then((res) => setMantenimientos(res.data))
      .catch(() => toast.error("❌ Error al cargar mantenimientos del equipo"));
  }, [id]);
  // maneja cambios en los campos editables
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // guarda los cambios realizados al equipo
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
// elimina el equipo
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
// muestra un mensaje de carga mientras se obtienen los datos
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

      {/*  Detalle del equipo */}
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
            {/* Campos editables */}
            <Campo label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} />
            <Campo label="Marca" name="marca" value={formData.marca} onChange={handleChange} />
            <Campo label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} />
            <Campo label="URL de la imagen" name="imagen_url" value={formData.imagen_url} onChange={handleChange} />

            <div style={fieldContainer}>
              <label style={labelStyle}>Estado:</label>
              <select name="estado" value={formData.estado || ""} onChange={handleChange} style={inputStyle}>
                <option value="Activo">Activo</option>
                <option value="En mantenimiento">En mantenimiento</option>
                <option value="Dañado">Dañado</option>
              </select>
            </div>

            <Campo label="Fecha de compra" name="fecha_compra" value={formData.fecha_compra} onChange={handleChange} />
            <Campo
              label="Periodo de mantenimiento"
              name="periodo_mantenimiento"
              value={formData.periodo_mantenimiento}
              onChange={handleChange}
            />

            <button onClick={handleGuardar} style={btn("#00b4d8", "white")}>
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

      {/*  Sección de mantenimientos */}
      <div
        style={{
          marginTop: "2rem",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          marginInline: "auto",
          padding: "1.5rem",
        }}
      >
        <h3 style={{ color: "#0077b6", textAlign: "center" }}>Historial de Mantenimientos</h3>

        {/* Botón para agregar mantenimiento */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <button
            onClick={() => navigate(`/mantenimientos/nuevo?equipo_id=${id}`)}
            style={btn("#00b4d8", "white")}
          >
            ➕ Agregar mantenimiento
          </button>
        </div>

        {mantenimientos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#555" }}>Este equipo no tiene mantenimientos registrados.</p>
        ) : (
          mantenimientos.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/mantenimientos/${m.id}`)}
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "0.8rem",
                marginTop: "0.8rem",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <b>{m.tipo === "Preventivo" ? "🧰" : "⚙️"} {m.tipo}</b> — {m.fecha}
              <p style={{ margin: "0.2rem 0", fontSize: "0.9rem" }}>
                <b>Agente:</b> {m.agente || "—"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const Campo = ({ label, name, value, onChange }) => (
  <div style={fieldContainer}>
    <label style={labelStyle}>{label}:</label>
    <input name={name} value={value || ""} onChange={onChange} style={inputStyle} />
  </div>
);

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
