//Controla la navegacion entre las paginas de la navegacion usando react router, tuve que importar las paginas y componentes
//todo lo que se enlaza tiene que tener su import aqui y abajo las rutas
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import EquiposPage from "./pages/EquiposPage";
import MantenimientosPage from "./pages/MantenimientosPage";
import Home from "./pages/Home";
import EquipoForm from "./components/EquipoForm";
import EquipoDetalle from "./pages/EquipoDetalle";
import MantenimientoDetalle from "./pages/MantenimientoDetalle";
import MantenimientoForm from "./components/MantenimientoForm";



//las routes son como los urls y a que vista/componente llevan
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Home />} />
        <Route path="/equipos" element={<EquiposPage />} />
        <Route path="/equipos/nuevo" element={<EquipoForm />} />
        <Route path="/mantenimientos" element={<MantenimientosPage />} />
        <Route path="/equipos/:id" element={<EquipoDetalle />} />
        <Route path="/mantenimientos/:id" element={<MantenimientoDetalle />} />
        <Route path="/mantenimientos/nuevo" element={<MantenimientoForm />} />
      </Routes>
    </Router>
  );
}

export default App;
