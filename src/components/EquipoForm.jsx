// Formulario para agregar un nuevo equipo
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EquipoForm() {
  const navigate = useNavigate();
  // Estado para los datos del formulario
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
// Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
// Enviar datos del formulario al servidor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/equipos", form);
      alert("✅ Equipo agregado correctamente");
      navigate("/equipos");
    } catch (err) {
      console.error(err);
      alert("❌ Error al conectar con el servidor");
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#0077b6" }}>
        Agregar nuevo equipo
      </h2>

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
        <input
          type="text"
          name="codigo"
          placeholder="Código"
          value={form.codigo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="marca"
          placeholder="Marca"
          value={form.marca}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="modelo"
          placeholder="Modelo"
          value={form.modelo}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="fecha_compra"
          value={form.fecha_compra}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="periodo_mantenimiento"
          placeholder="Periodo de mantenimiento"
          value={form.periodo_mantenimiento}
          onChange={handleChange}
          required
        />

        
        <input
          type="text"
          name="imagen_url"
          placeholder="URL de imagen (opcional)"
          value={form.imagen_url}
          onChange={handleChange}
        />

     
        <select
          name="estado"
          value={form.estado}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar estado</option>
          <option value="Activo">Activo</option>
          <option value="En mantenimiento">En mantenimiento</option>
          <option value="Dañado">Dañado</option>
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
          💾 Guardar equipo
        </button>

        <button
          type="button"
          onClick={() => navigate("/equipos")}
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

export default EquipoForm;
