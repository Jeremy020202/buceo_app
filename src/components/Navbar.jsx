import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        padding: "1rem",
        backgroundColor: "#0077b6",
      }}
    >
      <Link to="/equipos" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
        Equipos
      </Link>
      <Link to="/mantenimientos" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
        Mantenimientos
      </Link>
    </nav>
  );
}

export default Navbar;
