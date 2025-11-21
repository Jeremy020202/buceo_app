import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// 🟦 Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EquipoForm() {
  const navigate = useNavigate();
  const [, setEquipos] = useState([]);
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

  // ===============================
  //   AUTOGENERAR CÓDIGO
  // ===============================
  useEffect(() => {
    api
      .get("/equipos")
      .then((res) => {
        setEquipos(res.data || []);

        const numericCodes = (res.data || [])
          .map((eq) => {
            const n = parseInt(eq.codigo, 10);
            return isNaN(n) ? null : n;
          })
          .filter((n) => n !== null);

        const maxCodigo = numericCodes.length ? Math.max(...numericCodes) : 0;
        setForm((prev) => ({ ...prev, codigo: (maxCodigo + 1).toString() }));
      })
      .catch(() => {
        console.error("Error al cargar equipos");
        setForm((prev) => ({ ...prev, codigo: "1" }));
      });
  }, []);

  // ===============================
  //   MANEJAR CAMBIOS
  // ===============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===============================
  //   VALIDACIÓN DEL FORMULARIO
  // ===============================
  const validarFormulario = () => {
    if (!form.nombre.trim()) return "El nombre no puede estar vacío.";
    if (!form.marca.trim()) return "La marca no puede estar vacía.";
    if (!form.modelo.trim()) return "El modelo no puede estar vacío.";
    if (!form.fecha_compra) return "Debe seleccionar una fecha de compra.";
    if (!form.periodo_mantenimiento.trim())
      return "El periodo de mantenimiento no puede estar vacío.";
    if (isNaN(form.periodo_mantenimiento) || form.periodo_mantenimiento <= 0)
      return "El periodo de mantenimiento debe ser un número mayor que 0.";
    if (!form.estado) return "Debe seleccionar un estado.";
    return null;
  };

  // ===============================
  //   ENVIAR FORMULARIO
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validarFormulario();
    if (error) {
      toast.error("⚠️ " + error);
      return;
    }

    // Calcular próximo mantenimiento
    let proximo_mantenimiento = null;
    try {
      const fechaCompra = new Date(form.fecha_compra);
      proximo_mantenimiento = new Date(fechaCompra);
      proximo_mantenimiento.setMonth(
        fechaCompra.getMonth() + parseInt(form.periodo_mantenimiento)
      );
      proximo_mantenimiento = proximo_mantenimiento
        .toISOString()
        .split("T")[0];
    } catch {
      console.warn("No se pudo calcular el próximo mantenimiento");
    }

    const nuevoEquipo = {
      ...form,
      proximo_mantenimiento,
    };

    try {
      await api.post("/equipos", nuevoEquipo);
      toast.success("✅ Equipo agregado correctamente");

      setTimeout(() => navigate("/equipos"), 2000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al conectar con el servidor");
    }
  };

  // ===============================
  //   ESTILOS
  // ===============================
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
      {/*  TOAST CONTAINER */}
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
        {/* Código autogenerado */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
            alignItems: "center",
          }}
        >
          <label htmlFor="codigo" style={labelStyle}>
            Código
          </label>
          <input
            id="codigo"
            name="codigo"
            type="text"
            value={form.codigo}
            readOnly
            style={{ ...inputStyle, backgroundColor: "#eee", cursor: "not-allowed" }}
          />
        </div>

        {/* Campos de texto */}
        {["nombre", "marca", "modelo"].map((field) => (
          <div
            key={field}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.3rem",
              alignItems: "center",
            }}
          >
            <label htmlFor={field} style={labelStyle}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              value={form[field]}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        ))}

        {/* Fecha compra */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="fecha_compra" style={labelStyle}>Fecha de compra</label>
          <input
            id="fecha_compra"
            name="fecha_compra"
            type="date"
            value={form.fecha_compra}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Periodo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="periodo_mantenimiento" style={labelStyle}>
            Periodo de mantenimiento (meses)
          </label>
          <input
            id="periodo_mantenimiento"
            name="periodo_mantenimiento"
            type="number"
            min="1"
            placeholder="Ej: 3"
            value={form.periodo_mantenimiento}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Imagen */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="imagen_url" style={labelStyle}>URL de imagen (opcional)</label>
          <input
            id="imagen_url"
            name="imagen_url"
            type="text"
            value={form.imagen_url}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Estado */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", alignItems: "center" }}>
          <label htmlFor="estado" style={labelStyle}>Estado</label>
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Seleccionar estado</option>
            <option value="Activo">Activo</option>
            <option value="En mantenimiento">En mantenimiento</option>
            <option value="Dañado">Dañado</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        {/* Botones */}
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button type="submit" style={buttonBase("#0077b6", "white")}>
            💾 Guardar equipo
          </button>
          <button
            type="button"
            onClick={() => navigate("/equipos")}
            style={buttonBase("#90e0ef", "#03045e")}
          >
            🔙 Cancelar
          </button>
        </div>
      </form>

      {/* Fix visual */}
      <style>
        {`
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(40%) sepia(80%) saturate(400%) hue-rotate(170deg);
            border-radius: 50%;
            padding: 2px;
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
}

export default EquipoForm;
