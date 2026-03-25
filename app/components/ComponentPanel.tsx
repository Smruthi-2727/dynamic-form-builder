type Props = {
  addTextField: () => void
  addRadioButton: () => void
  addCheckbox: () => void
  addDropdown: () => void
  addDate: () => void
  addTime: () => void
  addRating: () => void
  addMatrix: () => void
  addSection: () => void
}

export default function ComponentPanel({
  addTextField,
  addRadioButton,
  addCheckbox,
  addDropdown,
  addDate,
  addTime,
  addRating,
  addMatrix,
  addSection
}: Props) {
  return (
    <div style={panelStyle}>
      <h2 style={titleStyle}>Components</h2>

      <button style={buttonStyle} onClick={addTextField}>
        Text Field
      </button>

      <button style={buttonStyle} onClick={addRadioButton}>
        Radio Button
      </button>

      <button style={buttonStyle} onClick={addCheckbox}>
        Checkbox
      </button>

      <button style={buttonStyle} onClick={addDropdown}>
        Dropdown
      </button>

      <button style={buttonStyle} onClick={addDate}>
        Date
      </button>

      <button style={buttonStyle} onClick={addTime}>
        Time
      </button>

      <button style={buttonStyle} onClick={addRating}>
        Rating
      </button>

      <button style={buttonStyle} onClick={addMatrix}>
        Matrix
      </button>

      <button style={buttonStyle} onClick={addSection}>
        + Add Section
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