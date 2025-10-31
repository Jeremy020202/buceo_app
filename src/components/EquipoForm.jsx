import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function EquipoForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    codigo: "",
    nombre: "",
    marca: "",
    modelo: "",
    fecha_compra: "",
    periodo_mantenimiento: "",
    estado: "",
    imagen_url: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/equipos", form);
      alert("✅ Equipo agregado correctamente");
      navigate("/equipos");
    } catch (err) {
      console.error(err);
      alert("❌ Error al conectar con el servidor");
    }
  };

  // 🎨 Estilos base actualizados
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

  // 💡 Estilo especial para el campo de fecha (ícono visible)
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
        Agregar nuevo equipo
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
        {/* Campos del formulario */}
        {[
          { name: "codigo", label: "Código", type: "text", required: true },
          { name: "nombre", label: "Nombre", type: "text", required: true },
          { name: "marca", label: "Marca", type: "text", required: true },
          { name: "modelo", label: "Modelo", type: "text", required: true },
          { name: "fecha_compra", label: "Fecha de compra", type: "date", required: true },
          {
            name: "periodo_mantenimiento",
            label: "Periodo de mantenimiento",
            type: "text",
            required: true,
          },
          {
            name: "imagen_url",
            label: "URL de imagen (opcional)",
            type: "text",
            required: false,
          },
        ].map((field) => (
          <div
            key={field.name}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              alignItems: "center",
            }}
          >
            <label htmlFor={field.name} style={labelStyle}>
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
              style={field.type === "date" ? dateInputStyle : inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#00b4d8")}
              onBlur={(e) => (e.target.style.borderColor = "#90e0ef")}
            />
          </div>
        ))}

        {/* Select de estado */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            alignItems: "center",
          }}
        >
          <label htmlFor="estado" style={labelStyle}>
            Estado
          </label>
          <select
            name="estado"
            id="estado"
            value={form.estado}
            onChange={handleChange}
            required
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "#00b4d8")}
            onBlur={(e) => (e.target.style.borderColor = "#90e0ef")}
          >
            <option value="">Seleccionar estado</option>
            <option value="Activo">Activo</option>
            <option value="En mantenimiento">En mantenimiento</option>
            <option value="Dañado">Dañado</option>
          </select>
        </div>

        {/* Botones */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          <button
            type="submit"
            style={buttonBase("#0077b6", "white")}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            💾 Guardar equipo
          </button>

          <button
            type="button"
            onClick={() => navigate("/equipos")}
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

export default EquipoForm;
