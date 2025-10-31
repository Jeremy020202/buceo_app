import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000", // URL del backend Flask
  timeout: 8000, // tiempo de espera de 8 segundos
  headers: {
    "Content-Type": "application/json",// encabezados comunes para todas las solicitudes
  },
});

export default api;
