function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: "#0077b6",
        color: "white",
        border: "none",
        fontSize: "2rem",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        cursor: "pointer",
        transition: "transform 0.2s ease, background-color 0.2s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#00b4d8")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0077b6")}
    >
      +
    </button>
  );
}

export default FloatingButton;
