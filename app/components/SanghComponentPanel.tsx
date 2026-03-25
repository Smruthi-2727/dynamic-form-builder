type Props = {
  addVibhag: () => void
  addBhag: () => void
  addNagar: () => void
  addVasathi: () => void
  addUpavasathi: () => void
}

export default function SanghComponentPanel({
  addVibhag,
  addBhag,
  addNagar,
  addVasathi,
  addUpavasathi
}: Props) {
  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>Sangh Components</h2>

      <button style={buttonStyle} onClick={addVibhag}>
        Select Vibhag
      </button>

      <button style={buttonStyle} onClick={addBhag}>
        Select Bhag
      </button>

      <button style={buttonStyle} onClick={addNagar}>
        Select Nagar
      </button>

      <button style={buttonStyle} onClick={addVasathi}>
        Select Vasathi
      </button>

      <button style={buttonStyle} onClick={addUpavasathi}>
        Select Upavasathi
      </button>
    </div>
  )
}

const panelStyle = {
  width: "260px",
  height: "100vh",
  background: "#f5f5f5",
  borderRight: "1px solid #ddd",
  padding: "25px 18px",
  boxSizing: "border-box" as const
}

const titleStyle = {
  textAlign: "center" as const,
  marginBottom: "18px",
  fontWeight: "600",
  fontSize: "20px"
}

const buttonStyle = {
  width: "100%",
  padding: "10px 12px",
  marginBottom: "12px",
  borderRadius: "4px",
  border: "1px solid #d0d0d0",
  background: "white",
  cursor: "pointer",
  fontSize: "14px"
}